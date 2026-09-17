-- Migration 002: Conversation Source Attribution & Strict Field Immutability
-- Projeto Essencial Good - Painel Admin & Chat ao Vivo

-- 1. ADICIONA CAMPOS DE ORIGEM DE CONVERSA EM public.conversations (IDEMPOTENTE)
ALTER TABLE public.conversations
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS source_path TEXT,
    ADD COLUMN IF NOT EXISTS source_host TEXT,
    ADD COLUMN IF NOT EXISTS source_title TEXT,
    ADD COLUMN IF NOT EXISTS source_product TEXT;

-- 2. ADICIONA CONSTRAINTS DE VALIDAÇÃO COM ALLOWLIST DE DOMÍNIOS VINCULADAS À TABELA public.conversations (IDEMPOTENTE)
DO $$
BEGIN
    -- Validador de source_url: max 2048 chars e URL HTTP/HTTPS estritamente pertencente à allowlist autorizada
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_conversations_source_url_valid' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT chk_conversations_source_url_valid
            CHECK (
                source_url IS NULL OR (
                    length(source_url) <= 2048 AND 
                    source_url ~* '^https?://(essencialgood\.com|www\.essencialgood\.com|[a-z0-9-]+\.essencialgood\.com|localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$'
                )
            );
    END IF;

    -- Validador de source_path: max 1024 chars e iniciante com / se nao NULL
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_conversations_source_path_valid' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT chk_conversations_source_path_valid
            CHECK (
                source_path IS NULL OR (
                    length(source_path) <= 1024 AND 
                    source_path ~ '^/'
                )
            );
    END IF;

    -- Validador de source_host: max 253 chars, sem espacos e estritamente pertencente a allowlist de dominios
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_conversations_source_host_valid' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT chk_conversations_source_host_valid
            CHECK (
                source_host IS NULL OR (
                    length(source_host) <= 253 AND 
                    source_host !~ '\s' AND
                    (
                        source_host IN ('essencialgood.com', 'www.essencialgood.com', 'localhost', '127.0.0.1') OR
                        source_host ~ '^[a-z0-9-]+\.essencialgood\.com$'
                    )
                )
            );
    END IF;

    -- Validador de source_title: max 300 chars
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_conversations_source_title_length' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT chk_conversations_source_title_length
            CHECK (source_title IS NULL OR length(source_title) <= 300);
    END IF;

    -- Validador de source_product: max 100 chars (sem enum fechado para permitir novos produtos no futuro)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_conversations_source_product_length' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT chk_conversations_source_product_length
            CHECK (source_product IS NULL OR length(source_product) <= 100);
    END IF;
END $$;

-- 3. ATUALIZA O TRIGGER DE NORMALIZAÇÃO DE CONVERSA NO BEFORE INSERT (VISITANTE)
CREATE OR REPLACE FUNCTION public.normalize_visitor_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin_or_agent() THEN
        NEW.visitor_id := auth.uid();
        NEW.status := 'open';
        NEW.assigned_admin_id := NULL;
        NEW.created_at := now();
        NEW.updated_at := now();
        NEW.last_message_at := now();

        -- 1. Normalização e validação de allowlist em source_url
        IF NEW.source_url IS NOT NULL THEN
            NEW.source_url := trim(NEW.source_url);
            IF length(NEW.source_url) = 0 OR 
               NEW.source_url !~* '^https?://(essencialgood\.com|www\.essencialgood\.com|[a-z0-9-]+\.essencialgood\.com|localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$' THEN 
                NEW.source_url := NULL; 
            END IF;
        END IF;

        -- 2. Normalização de source_path
        IF NEW.source_path IS NOT NULL THEN
            NEW.source_path := trim(NEW.source_path);
            IF length(NEW.source_path) = 0 OR NEW.source_path !~ '^/' THEN 
                NEW.source_path := NULL; 
            END IF;
        END IF;

        -- 3. Normalização e validação de allowlist em source_host (lowercase e sem espacos)
        IF NEW.source_host IS NOT NULL THEN
            NEW.source_host := lower(trim(NEW.source_host));
            IF length(NEW.source_host) = 0 OR 
               NEW.source_host ~ '\s' OR
               (
                   NEW.source_host NOT IN ('essencialgood.com', 'www.essencialgood.com', 'localhost', '127.0.0.1') AND
                   NEW.source_host !~ '^[a-z0-9-]+\.essencialgood\.com$'
               ) THEN 
                NEW.source_host := NULL; 
            END IF;
        END IF;

        -- 4. Normalização de source_title
        IF NEW.source_title IS NOT NULL THEN
            NEW.source_title := trim(NEW.source_title);
            IF length(NEW.source_title) = 0 THEN 
                NEW.source_title := NULL; 
            END IF;
        END IF;

        -- 5. Normalização de source_product
        IF NEW.source_product IS NOT NULL THEN
            NEW.source_product := lower(trim(NEW.source_product));
            IF length(NEW.source_product) = 0 THEN 
                NEW.source_product := NULL; 
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 4. ATUALIZA A FUNÇÃO DE PROTEÇÃO DE CAMPOS DE CONVERSAS (BEFORE UPDATE)
CREATE OR REPLACE FUNCTION public.protect_conversation_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. FLUXO INTERNO (disparado por trigger do sistema como update_conversation_last_message_at)
    IF pg_trigger_depth() > 1 THEN
        -- Confirma que NENHUM outro campo além de last_message_at e updated_at foi modificado
        IF OLD.id IS DISTINCT FROM NEW.id OR
           OLD.visitor_id IS DISTINCT FROM NEW.visitor_id OR
           OLD.visitor_name IS DISTINCT FROM NEW.visitor_name OR
           OLD.visitor_email IS DISTINCT FROM NEW.visitor_email OR
           OLD.status IS DISTINCT FROM NEW.status OR
           OLD.assigned_admin_id IS DISTINCT FROM NEW.assigned_admin_id OR
           OLD.created_at IS DISTINCT FROM NEW.created_at OR
           OLD.source_url IS DISTINCT FROM NEW.source_url OR
           OLD.source_path IS DISTINCT FROM NEW.source_path OR
           OLD.source_host IS DISTINCT FROM NEW.source_host OR
           OLD.source_title IS DISTINCT FROM NEW.source_title OR
           OLD.source_product IS DISTINCT FROM NEW.source_product THEN
            RAISE EXCEPTION 'Atualização interna de conversa tentou modificar campos restritos.';
        END IF;

        -- Permite apenas a atualização interna de last_message_at e updated_at
        RETURN NEW;
    END IF;

    -- 2. FLUXO DIRETO (requisição direta do cliente via API de UPDATE)
    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Visitantes não possuem permissão para atualizar conversas.';
    END IF;

    -- Bloqueia alteração direta de last_message_at pelo cliente
    IF OLD.last_message_at IS DISTINCT FROM NEW.last_message_at THEN
        RAISE EXCEPTION 'O campo last_message_at só pode ser atualizado pelo sistema ao inserir mensagens.';
    END IF;

    -- Bloqueia alteração de campos imutáveis no UPDATE direto da equipe
    IF OLD.id IS DISTINCT FROM NEW.id THEN
        RAISE EXCEPTION 'O id da conversa é imutável.';
    END IF;

    IF OLD.visitor_id IS DISTINCT FROM NEW.visitor_id THEN
        RAISE EXCEPTION 'O campo visitor_id é imutável.';
    END IF;

    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
        RAISE EXCEPTION 'O campo created_at é imutável.';
    END IF;

    -- Bloqueia alteração dos campos de origem de conversa após a criação
    IF OLD.source_url IS DISTINCT FROM NEW.source_url THEN
        RAISE EXCEPTION 'O campo source_url é imutável após a criação da conversa.';
    END IF;

    IF OLD.source_path IS DISTINCT FROM NEW.source_path THEN
        RAISE EXCEPTION 'O campo source_path é imutável após a criação da conversa.';
    END IF;

    IF OLD.source_host IS DISTINCT FROM NEW.source_host THEN
        RAISE EXCEPTION 'O campo source_host é imutável após a criação da conversa.';
    END IF;

    IF OLD.source_title IS DISTINCT FROM NEW.source_title THEN
        RAISE EXCEPTION 'O campo source_title é imutável após a criação da conversa.';
    END IF;

    IF OLD.source_product IS DISTINCT FROM NEW.source_product THEN
        RAISE EXCEPTION 'O campo source_product é imutável após a criação da conversa.';
    END IF;

    RETURN NEW;
END;
$$;
