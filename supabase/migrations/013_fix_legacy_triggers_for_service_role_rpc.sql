-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 013: FIX LEGACY TRIGGERS FOR SERVICE ROLE RPC
-- ============================================================================
-- Esta migration atualiza as funções de trigger public.normalize_visitor_conversation()
-- e public.normalize_new_message() para compatibilizá-las com invocações via RPC/Service Role
-- (Edge Functions).
--
-- PROBLEMA CORRIGIDO:
-- Quando executadas sob o cliente service_role (RPC p_create_visitor_conversation e
-- p_send_visitor_message), a função auth.uid() no PostgreSQL avalia para NULL.
-- As triggers legadas substituíam indevidamente NEW.visitor_id / NEW.sender_id por auth.uid(),
-- forçando NULL nas colunas NOT NULL e gerando erro PostgreSQL 23502 (CREATE_CONVERSATION_FAILED).
--
-- GARANTIAS DE SEGURANÇA:
-- 1. Preserva o valor de NEW.visitor_id e NEW.sender_id fornecidos pela RPC em execuções com service_role.
-- 2. Preserva a regra de segurança em requisições diretas de visitantes (PostgREST com JWT de visitante):
--    se um visitante tentar passar um ID de outro usuário, a trigger força NEW.visitor_id := auth.uid().
-- 3. Preserva o privilégio administrativo (is_admin_or_agent).
-- 4. Mantém a normalização e sanitização dos campos de origem de conversa.
-- ============================================================================

BEGIN;

-- 1. ATUALIZA A FUNÇÃO DA TRIGGER normalize_visitor_conversation (BEFORE INSERT ON public.conversations)
CREATE OR REPLACE FUNCTION public.normalize_visitor_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_jwt_role TEXT;
BEGIN
    -- Captura com resiliência a role do contexto da requisição JWT (PostgREST / Supabase Auth)
    v_jwt_role := COALESCE(
        current_setting('request.jwt.claim.role', true),
        current_setting('request.jwt.claims', true)::jsonb ->> 'role',
        auth.role()
    );

    -- 1. FLUXO ADMINISTRATIVO OU SERVICE ROLE (RPC SECURITIZADA VIA EDGE FUNCTION):
    -- Preserva o visitor_id explicitamente fornecido (p_visitor_id da RPC ou cadastro admin)
    IF public.is_admin_or_agent() OR v_jwt_role = 'service_role' THEN
        IF NEW.status IS NULL THEN
            NEW.status := 'open';
        END IF;
        IF NEW.created_at IS NULL THEN
            NEW.created_at := now();
        END IF;
        IF NEW.updated_at IS NULL THEN
            NEW.updated_at := now();
        END IF;
        IF NEW.last_message_at IS NULL THEN
            NEW.last_message_at := now();
        END IF;
    -- 2. FLUXO DIRETO DO VISITANTE (POSTGREST API COM JWT DE VISITANTE):
    ELSE
        -- Força obrigatoriamente visitor_id = auth.uid() para evitar spoofing de ID de outro visitante
        IF auth.uid() IS NOT NULL THEN
            NEW.visitor_id := auth.uid();
        END IF;
        NEW.status := 'open';
        NEW.assigned_admin_id := NULL;
        NEW.created_at := now();
        NEW.updated_at := now();
        NEW.last_message_at := now();
    END IF;

    -- Normalização e sanitização de origem (aplica-se a todos os fluxos)
    IF NEW.source_url IS NOT NULL THEN
        NEW.source_url := trim(NEW.source_url);
        IF length(NEW.source_url) = 0 OR
           NEW.source_url !~* '^https?://(essencialgood\.com|www\.essencialgood\.com|[a-z0-9-]+\.essencialgood\.com|localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$' THEN
            NEW.source_url := NULL;
        END IF;
    END IF;

    IF NEW.source_path IS NOT NULL THEN
        NEW.source_path := trim(NEW.source_path);
        IF length(NEW.source_path) = 0 OR NEW.source_path !~ '^/' THEN
            NEW.source_path := NULL;
        END IF;
    END IF;

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

    IF NEW.source_title IS NOT NULL THEN
        NEW.source_title := trim(NEW.source_title);
        IF length(NEW.source_title) = 0 THEN
            NEW.source_title := NULL;
        END IF;
    END IF;

    IF NEW.source_product IS NOT NULL THEN
        NEW.source_product := lower(trim(NEW.source_product));
        IF length(NEW.source_product) = 0 THEN
            NEW.source_product := NULL;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 2. ATUALIZA A FUNÇÃO DA TRIGGER normalize_new_message (BEFORE INSERT ON public.messages)
CREATE OR REPLACE FUNCTION public.normalize_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_jwt_role TEXT;
BEGIN
    v_jwt_role := COALESCE(
        current_setting('request.jwt.claim.role', true),
        current_setting('request.jwt.claims', true)::jsonb ->> 'role',
        auth.role()
    );

    -- 1. FLUXO ADMINISTRATIVO OU SERVICE ROLE (RPC SECURITIZADA VIA EDGE FUNCTION):
    IF public.is_admin_or_agent() OR v_jwt_role = 'service_role' THEN
        IF NEW.created_at IS NULL THEN
            NEW.created_at := now();
        END IF;
    -- 2. FLUXO DIRETO DO VISITANTE (POSTGREST API COM JWT DE VISITANTE):
    ELSE
        IF auth.uid() IS NOT NULL THEN
            NEW.sender_id := auth.uid();
        END IF;
        NEW.sender_type := 'visitor';
        IF NEW.created_at IS NULL THEN
            NEW.created_at := now();
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.normalize_visitor_conversation() IS
  'Normaliza conversas no BEFORE INSERT, preservando visitor_id em execuções de service_role/RPC e forçando auth.uid() em requisições diretas de visitante.';

COMMENT ON FUNCTION public.normalize_new_message() IS
  'Normaliza mensagens no BEFORE INSERT, preservando sender_id em execuções de service_role/RPC e forçando auth.uid() em requisições diretas de visitante.';

COMMIT;
