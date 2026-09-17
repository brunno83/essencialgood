-- Migration 003: Conversation Archiving & Permanent Deletion (Refatoração de Segurança e Gestão)
-- Projeto Essencial Good - Painel Admin & Chat ao Vivo

-- 1. ADICIONA COLUNAS E FOREIGN KEY DE MANEIRA IDEMPOTENTE COM VALIDAÇÃO DE TIPOS
DO $$
DECLARE
    v_col_type TEXT;
BEGIN
    -- 1.1 Coluna archived_at em public.conversations
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'archived_at'
    ) THEN
        SELECT data_type INTO v_col_type
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'archived_at';

        IF v_col_type NOT IN ('timestamp with time zone', 'USER-DEFINED') THEN
            RAISE EXCEPTION 'Coluna archived_at preexistente possui tipo incompatível: %', v_col_type;
        END IF;
    ELSE
        ALTER TABLE public.conversations ADD COLUMN archived_at TIMESTAMPTZ NULL;
    END IF;

    -- 1.2 Coluna archived_by em public.conversations
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'archived_by'
    ) THEN
        SELECT data_type INTO v_col_type
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'archived_by';

        IF v_col_type NOT IN ('uuid') THEN
            RAISE EXCEPTION 'Coluna archived_by preexistente possui tipo incompatível: %', v_col_type;
        END IF;
    ELSE
        ALTER TABLE public.conversations ADD COLUMN archived_by UUID NULL;
    END IF;

    -- 1.3 Foreign Key fk_conversations_archived_by com ON DELETE SET NULL
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_conversations_archived_by' 
          AND conrelid = 'public.conversations'::regclass
    ) THEN
        ALTER TABLE public.conversations
            ADD CONSTRAINT fk_conversations_archived_by
            FOREIGN KEY (archived_by) REFERENCES public.admin_profiles(id)
            ON DELETE SET NULL;
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_class ft ON c.confrelid = ft.oid
            WHERE c.conname = 'fk_conversations_archived_by'
              AND t.relname = 'conversations'
              AND ft.relname = 'admin_profiles'
              AND c.confdeltype = 'n'
        ) THEN
            RAISE EXCEPTION 'Constraint fk_conversations_archived_by preexistente é incompatível com a definição esperada.';
        END IF;
    END IF;
END $$;

-- 2. CRIA ÍNDICES PARCIAIS DE DESEMPENHO PARA LISTAGEM (IDEMPOTENTE)
CREATE INDEX IF NOT EXISTS idx_conversations_active_last_message
    ON public.conversations (last_message_at DESC)
    WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_archived_at
    ON public.conversations (archived_at DESC)
    WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_archived_by
    ON public.conversations (archived_by)
    WHERE archived_by IS NOT NULL;

-- 3. FUNÇÃO DE PROTEÇÃO DE CAMPOS DE CONVERSAS (BEFORE UPDATE)
CREATE OR REPLACE FUNCTION public.protect_conversation_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- 1. FLUXO INTERNO (disparado por triggers do sistema como update_conversation_last_message_at)
    IF pg_trigger_depth() > 1 THEN
        -- Confirma que NENHUM outro campo restrito foi modificado além de last_message_at e updated_at
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
           OLD.source_product IS DISTINCT FROM NEW.source_product OR
           OLD.archived_at IS DISTINCT FROM NEW.archived_at OR
           OLD.archived_by IS DISTINCT FROM NEW.archived_by THEN
            RAISE EXCEPTION 'Atualização interna de conversa tentou modificar campos restritos.';
        END IF;

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
    IF OLD.source_url IS DISTINCT FROM NEW.source_url OR
       OLD.source_path IS DISTINCT FROM NEW.source_path OR
       OLD.source_host IS DISTINCT FROM NEW.source_host OR
       OLD.source_title IS DISTINCT FROM NEW.source_title OR
       OLD.source_product IS DISTINCT FROM NEW.source_product THEN
        RAISE EXCEPTION 'Os campos de origem de conversa são imutáveis após a criação.';
    END IF;

    -- Bloqueia alteração direta de archived_at e archived_by via REST (permite apenas se invocado via RPC autenticada)
    IF OLD.archived_at IS DISTINCT FROM NEW.archived_at OR
       OLD.archived_by IS DISTINCT FROM NEW.archived_by THEN
        IF current_setting('app.allow_archive_mutation', true) IS DISTINCT FROM 'true' THEN
            RAISE EXCEPTION 'Os campos de arquivamento só podem ser modificados através das RPCs archive_conversation e restore_conversation.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 4. FUNÇÃO DE NORMALIZAÇÃO DE MENSAGENS (BEFORE INSERT) — COM LOCK EXCLUSIVO FOR UPDATE
CREATE OR REPLACE FUNCTION public.normalize_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_user_role TEXT;
    v_conv_id UUID;
    v_archived_at TIMESTAMPTZ;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Autenticação necessária para enviar mensagem.';
    END IF;

    IF NEW.conversation_id IS NULL THEN
        RAISE EXCEPTION 'O campo conversation_id é obrigatório.';
    END IF;

    -- CONSULTA E BLOQUEIO CONCORRENTE EXCLUSIVO FOR UPDATE NA LINHA DA CONVERSA
    SELECT id, archived_at INTO v_conv_id, v_archived_at
    FROM public.conversations
    WHERE id = NEW.conversation_id
    FOR UPDATE;

    -- 1. VALIDAÇÃO DE CONVERSA INEXISTENTE
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversa não encontrada.';
    END IF;

    -- 2. VALIDAÇÃO DE CONVERSA ARQUIVADA
    IF v_archived_at IS NOT NULL THEN
        RAISE EXCEPTION 'Esta conversa está arquivada e não pode receber novas mensagens.';
    END IF;

    -- Força campos controlados exclusivamente pelo servidor
    NEW.sender_id := v_user_id;
    NEW.created_at := now();
    NEW.read_at := NULL;
    NEW.content := trim(NEW.content);

    IF length(NEW.content) = 0 THEN
        RAISE EXCEPTION 'O conteúdo da mensagem não pode ser vazio ou conter apenas espaços.';
    END IF;

    IF length(NEW.content) > 4000 THEN
        RAISE EXCEPTION 'O conteúdo da mensagem excede o limite de 4000 caracteres.';
    END IF;

    -- Determina o sender_type pelo banco de dados com base no perfil autenticado
    IF public.is_admin() THEN
        NEW.sender_type := 'admin';
    ELSE
        SELECT role INTO v_user_role
        FROM public.admin_profiles
        WHERE id = v_user_id;

        IF v_user_role = 'agent' THEN
            NEW.sender_type := 'agent';
        ELSE
            NEW.sender_type := 'visitor';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 5. FUNÇÃO DE NORMALIZAÇÃO DE CONVERSA DO VISITANTE (BEFORE INSERT)
CREATE OR REPLACE FUNCTION public.normalize_visitor_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT public.is_admin_or_agent() THEN
        NEW.visitor_id := auth.uid();
        NEW.status := 'open';
        NEW.assigned_admin_id := NULL;
        NEW.created_at := now();
        NEW.updated_at := now();
        NEW.last_message_at := now();
        NEW.archived_at := NULL;
        NEW.archived_by := NULL;

        -- Normalização de source_url
        IF NEW.source_url IS NOT NULL THEN
            NEW.source_url := trim(NEW.source_url);
            IF length(NEW.source_url) = 0 OR 
               NEW.source_url !~* '^https?://(essencialgood\.com|www\.essencialgood\.com|[a-z0-9-]+\.essencialgood\.com|localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$' THEN 
                NEW.source_url := NULL; 
            END IF;
        END IF;

        -- Normalização de source_path
        IF NEW.source_path IS NOT NULL THEN
            NEW.source_path := trim(NEW.source_path);
            IF length(NEW.source_path) = 0 OR NEW.source_path !~ '^/' THEN 
                NEW.source_path := NULL; 
            END IF;
        END IF;

        -- Normalização de source_host
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

        -- Normalização de source_title
        IF NEW.source_title IS NOT NULL THEN
            NEW.source_title := trim(NEW.source_title);
            IF length(NEW.source_title) = 0 THEN 
                NEW.source_title := NULL; 
            END IF;
        END IF;

        -- Normalização de source_product
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

-- 6. RPC: archive_conversation(p_conversation_id UUID)
CREATE OR REPLACE FUNCTION public.archive_conversation(p_conversation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_conv RECORD;
    v_now TIMESTAMPTZ := now();
    v_res_archived_at TIMESTAMPTZ;
    v_res_archived_by UUID;
    v_res_status TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores ou agentes podem arquivar conversas.';
    END IF;

    IF p_conversation_id IS NULL THEN
        RAISE EXCEPTION 'ID da conversa inválido.';
    END IF;

    -- BLOQUEIO EXCLUSIVO DE LINHA FOR UPDATE
    SELECT id, archived_at, archived_by, status INTO v_conv
    FROM public.conversations
    WHERE id = p_conversation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversa não encontrada.';
    END IF;

    -- PERMITE A ALTERAÇÃO DOS CAMPOS DE ARQUIVAMENTO NO CONTEXTO DA RPC
    PERFORM set_config('app.allow_archive_mutation', 'true', true);

    IF v_conv.archived_at IS NULL THEN
        UPDATE public.conversations
        SET archived_at = v_now,
            archived_by = v_user_id,
            status = 'closed',
            updated_at = v_now
        WHERE id = p_conversation_id;

        v_res_archived_at := v_now;
        v_res_archived_by := v_user_id;
        v_res_status := 'closed';
    ELSE
        -- Retorno IDEMPOTENTE com os dados reais já gravados no banco
        v_res_archived_at := v_conv.archived_at;
        v_res_archived_by := v_conv.archived_by;
        v_res_status := v_conv.status;
    END IF;

    RETURN jsonb_build_object(
        'id', p_conversation_id,
        'archived_at', v_res_archived_at,
        'archived_by', v_res_archived_by,
        'status', v_res_status,
        'success', true
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.archive_conversation(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.archive_conversation(UUID) TO authenticated;

-- 7. RPC: restore_conversation(p_conversation_id UUID)
CREATE OR REPLACE FUNCTION public.restore_conversation(p_conversation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_conv RECORD;
    v_now TIMESTAMPTZ := now();
    v_res_status TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores ou agentes podem restaurar conversas.';
    END IF;

    IF p_conversation_id IS NULL THEN
        RAISE EXCEPTION 'ID da conversa inválido.';
    END IF;

    SELECT id, archived_at, status INTO v_conv
    FROM public.conversations
    WHERE id = p_conversation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversa não encontrada.';
    END IF;

    PERFORM set_config('app.allow_archive_mutation', 'true', true);

    IF v_conv.archived_at IS NOT NULL THEN
        UPDATE public.conversations
        SET archived_at = NULL,
            archived_by = NULL,
            updated_at = v_now
        WHERE id = p_conversation_id;
    END IF;

    v_res_status := v_conv.status;

    RETURN jsonb_build_object(
        'id', p_conversation_id,
        'archived_at', NULL,
        'archived_by', NULL,
        'status', v_res_status,
        'success', true
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.restore_conversation(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_conversation(UUID) TO authenticated;

-- 8. RPC: delete_conversation_permanently(p_conversation_id UUID)
CREATE OR REPLACE FUNCTION public.delete_conversation_permanently(p_conversation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_conv RECORD;
    v_msg_count INT := 0;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    -- VALIDAÇÃO EXCLUSIVA DE ADMIN (AGENTES E VISITANTES SÃO REJEITADOS)
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores possuem permissão para excluir conversas permanentemente.';
    END IF;

    IF p_conversation_id IS NULL THEN
        RAISE EXCEPTION 'ID da conversa inválido.';
    END IF;

    SELECT id, archived_at INTO v_conv
    FROM public.conversations
    WHERE id = p_conversation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversa não encontrada.';
    END IF;

    -- REGRA OBRIGATÓRIA: A CONVERSA DEVE ESTAR PREVIAMENTE ARQUIVADA
    IF v_conv.archived_at IS NULL THEN
        RAISE EXCEPTION 'A conversa precisa estar arquivada antes de ser excluída permanentemente.';
    END IF;

    -- Conta mensagens antes da exclusão
    SELECT COUNT(*) INTO v_msg_count
    FROM public.messages
    WHERE conversation_id = p_conversation_id;

    -- Exclusão atômica da conversa (mensagens são apagadas via ON DELETE CASCADE na FK)
    DELETE FROM public.conversations
    WHERE id = p_conversation_id;

    RETURN jsonb_build_object(
        'id', p_conversation_id,
        'messages_deleted', v_msg_count,
        'success', true
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.delete_conversation_permanently(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_conversation_permanently(UUID) TO authenticated;
