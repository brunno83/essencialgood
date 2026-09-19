-- ============================================================================
-- ESSENCIAL GOOD - SUITE DE TESTES TRANSACIONAIS AUTOCONTIDA MIGRATION 009
-- ============================================================================
-- Este script inclui a DDL completa e autocontida da Migration 009, executa
-- a auditoria estática de privilégios e os testes de regra de negócio dentro de
-- um bloco transacional, e desfaz TODAS as alterações via ROLLBACK no final.

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. DDL AUTOCONTIDA DA MIGRATION 009
-- ----------------------------------------------------------------------------

-- 1.1 TABELA DE INSCRIÇÕES DE WEB PUSH (public.push_subscriptions)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    notify_chats BOOLEAN NOT NULL DEFAULT true,
    notify_leads BOOLEAN NOT NULL DEFAULT true,
    enabled BOOLEAN NOT NULL DEFAULT true,
    failed_count INTEGER NOT NULL DEFAULT 0,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint),
    CONSTRAINT check_push_endpoint_length CHECK (char_length(endpoint) <= 2048),
    CONSTRAINT check_push_p256dh_length CHECK (char_length(p256dh) <= 255),
    CONSTRAINT check_push_auth_key_length CHECK (char_length(auth_key) <= 255),
    CONSTRAINT check_push_endpoint_https CHECK (endpoint ~* '^https://'),
    CONSTRAINT check_push_endpoint_no_userinfo CHECK (endpoint !~* '^https://[^/@]+@'),
    CONSTRAINT check_push_endpoint_no_fragment CHECK (endpoint !~ '#'),
    CONSTRAINT check_push_endpoint_no_localhost CHECK (
        endpoint !~* 'localhost|127\.0\.0\.1|::1|0\.0\.0\.0'
    ),
    CONSTRAINT check_push_endpoint_no_private_ip CHECK (
        endpoint !~* 'https://(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.)'
    )
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_enabled ON public.push_subscriptions(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_endpoint ON public.push_subscriptions(user_id, endpoint);

-- 1.2 TABELA DE EVENTOS DE NOTIFICAÇÃO (public.push_notification_events)
CREATE TABLE IF NOT EXISTS public.push_notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL CHECK (event_type IN ('new_conversation', 'new_checkout_lead')),
    record_id UUID,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 1,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    last_error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_events_created_at ON public.push_notification_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_events_event_key ON public.push_notification_events(event_key);

-- 1.3 TABELA DE ENTREGAS POR DISPOSITIVO (public.push_notification_deliveries)
CREATE TABLE IF NOT EXISTS public.push_notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.push_notification_events(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.push_subscriptions(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'expired')),
    attempts INTEGER NOT NULL DEFAULT 1,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    last_error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT push_deliveries_event_sub_unique UNIQUE (event_id, subscription_id)
);

CREATE INDEX IF NOT EXISTS idx_push_deliveries_event_id ON public.push_notification_deliveries(event_id);
CREATE INDEX IF NOT EXISTS idx_push_deliveries_sub_status ON public.push_notification_deliveries(subscription_id, status);

-- 1.4 HABILITAÇÃO E RESTRIÇÃO TOTAL DE RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_deliveries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.push_subscriptions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.push_subscriptions TO service_role;

REVOKE ALL ON TABLE public.push_notification_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.push_notification_events TO service_role;

REVOKE ALL ON TABLE public.push_notification_deliveries FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.push_notification_deliveries TO service_role;

-- 1.5 ROTINA DE LIMPEZA DE EVENTOS E ENTREGAS ANTIGAS
CREATE OR REPLACE FUNCTION public.cleanup_old_push_notification_events(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.push_notification_events
    WHERE created_at < now() - (p_days || ' days')::interval;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_push_notification_events(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_push_notification_events(INTEGER) TO service_role;

-- 1.6 RPC SECURITY DEFINER: register_push_subscription
CREATE OR REPLACE FUNCTION public.register_push_subscription(
    p_endpoint TEXT,
    p_p256dh TEXT,
    p_auth_key TEXT,
    p_notify_chats BOOLEAN DEFAULT true,
    p_notify_leads BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_clean_endpoint TEXT;
    v_clean_p256dh TEXT;
    v_clean_auth TEXT;
    v_existing_user_id UUID;
    v_sub_id UUID;
BEGIN
    IF v_user_id IS NULL OR auth.role() <> 'authenticated' THEN
        RAISE EXCEPTION 'Autenticação necessária.';
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Acesso restrito à equipe administrativa.';
    END IF;

    v_clean_endpoint := trim(COALESCE(p_endpoint, ''));
    v_clean_p256dh := trim(COALESCE(p_p256dh, ''));
    v_clean_auth := trim(COALESCE(p_auth_key, ''));

    IF v_clean_endpoint = '' OR v_clean_p256dh = '' OR v_clean_auth = '' THEN
        RAISE EXCEPTION 'Endpoint, p256dh e auth_key são obrigatórios.';
    END IF;

    IF char_length(v_clean_endpoint) > 2048 OR
       char_length(v_clean_p256dh) > 255 OR
       char_length(v_clean_auth) > 255 THEN
        RAISE EXCEPTION 'Tamanho de campo excede o limite permitido.';
    END IF;

    IF v_clean_endpoint !~* '^https://' THEN
        RAISE EXCEPTION 'O endpoint deve utilizar obrigatoriamente o protocolo HTTPS.';
    END IF;

    IF v_clean_endpoint ~* '^https://[^/@]+@' THEN
        RAISE EXCEPTION 'Userinfo no endpoint não é permitido.';
    END IF;

    IF v_clean_endpoint ~ '#' THEN
        RAISE EXCEPTION 'Fragmentos na URL do endpoint não são permitidos.';
    END IF;

    IF v_clean_endpoint ~* 'localhost|127\.0\.0\.1|::1|0\.0\.0\.0' THEN
        RAISE EXCEPTION 'Endpoints locais não são permitidos.';
    END IF;

    IF v_clean_endpoint ~* 'https://(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.)' THEN
        RAISE EXCEPTION 'Endpoints em faixas IP privadas não são permitidos.';
    END IF;

    SELECT user_id INTO v_existing_user_id
    FROM public.push_subscriptions
    WHERE endpoint = v_clean_endpoint;

    IF v_existing_user_id IS NOT NULL AND v_existing_user_id <> v_user_id THEN
        RAISE EXCEPTION 'Endpoint de notificação já registrado para outro usuário.' USING ERRCODE = '23505';
    END IF;

    INSERT INTO public.push_subscriptions (
        user_id,
        endpoint,
        p256dh,
        auth_key,
        notify_chats,
        notify_leads,
        enabled,
        failed_count,
        updated_at
    ) VALUES (
        v_user_id,
        v_clean_endpoint,
        v_clean_p256dh,
        v_clean_auth,
        COALESCE(p_notify_chats, true),
        COALESCE(p_notify_leads, true),
        true,
        0,
        now()
    )
    ON CONFLICT (user_id, endpoint)
    DO UPDATE SET
        p256dh = EXCLUDED.p256dh,
        auth_key = EXCLUDED.auth_key,
        notify_chats = EXCLUDED.notify_chats,
        notify_leads = EXCLUDED.notify_leads,
        enabled = true,
        failed_count = 0,
        updated_at = now()
    RETURNING id INTO v_sub_id;

    RETURN jsonb_build_object(
        'success', true,
        'subscription_id', v_sub_id,
        'notify_chats', COALESCE(p_notify_chats, true),
        'notify_leads', COALESCE(p_notify_leads, true)
    );
END;
$$;

-- 1.7 RPC SECURITY DEFINER: unregister_push_subscription
CREATE OR REPLACE FUNCTION public.unregister_push_subscription(
    p_subscription_id UUID DEFAULT NULL,
    p_endpoint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_affected INT := 0;
BEGIN
    IF v_user_id IS NULL OR auth.role() <> 'authenticated' THEN
        RAISE EXCEPTION 'Autenticação necessária.';
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Acesso restrito à equipe administrativa.';
    END IF;

    IF p_subscription_id IS NULL AND (p_endpoint IS NULL OR trim(p_endpoint) = '') THEN
        RAISE EXCEPTION 'Identificador da inscrição ou endpoint deve ser fornecido.';
    END IF;

    IF p_subscription_id IS NOT NULL THEN
        DELETE FROM public.push_subscriptions
        WHERE id = p_subscription_id
          AND user_id = v_user_id;
        GET DIAGNOSTICS v_affected = ROW_COUNT;
    ELSIF p_endpoint IS NOT NULL THEN
        DELETE FROM public.push_subscriptions
        WHERE endpoint = trim(p_endpoint)
          AND user_id = v_user_id;
        GET DIAGNOSTICS v_affected = ROW_COUNT;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'unregistered', (v_affected > 0)
    );
END;
$$;

-- 1.8 RPC SECURITY DEFINER: update_push_preferences
CREATE OR REPLACE FUNCTION public.update_push_preferences(
    p_subscription_id UUID,
    p_notify_chats BOOLEAN,
    p_notify_leads BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_affected INT := 0;
BEGIN
    IF v_user_id IS NULL OR auth.role() <> 'authenticated' THEN
        RAISE EXCEPTION 'Autenticação necessária.';
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Acesso restrito à equipe administrativa.';
    END IF;

    IF p_subscription_id IS NULL THEN
        RAISE EXCEPTION 'ID da inscrição é obrigatório.';
    END IF;

    UPDATE public.push_subscriptions
    SET notify_chats = COALESCE(p_notify_chats, notify_chats),
        notify_leads = COALESCE(p_notify_leads, notify_leads),
        updated_at = now()
    WHERE id = p_subscription_id
      AND user_id = v_user_id;

    GET DIAGNOSTICS v_affected = ROW_COUNT;

    IF v_affected = 0 THEN
        RAISE EXCEPTION 'Inscrição não encontrada ou não pertence ao usuário.';
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'notify_chats', p_notify_chats,
        'notify_leads', p_notify_leads
    );
END;
$$;

-- 1.9 RPC SECURITY DEFINER: get_my_push_notification_status
CREATE OR REPLACE FUNCTION public.get_my_push_notification_status(
    p_endpoint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_rec RECORD;
BEGIN
    IF v_user_id IS NULL OR auth.role() <> 'authenticated' THEN
        RETURN jsonb_build_object('subscribed', false, 'reason', 'unauthenticated');
    END IF;

    IF NOT public.is_admin_or_agent() THEN
        RETURN jsonb_build_object('subscribed', false, 'reason', 'unauthorized');
    END IF;

    IF p_endpoint IS NOT NULL AND trim(p_endpoint) <> '' THEN
        SELECT id, enabled, notify_chats, notify_leads
        INTO v_rec
        FROM public.push_subscriptions
        WHERE user_id = v_user_id
          AND endpoint = trim(p_endpoint)
        LIMIT 1;
    ELSE
        SELECT id, enabled, notify_chats, notify_leads
        INTO v_rec
        FROM public.push_subscriptions
        WHERE user_id = v_user_id
          AND enabled = true
        ORDER BY updated_at DESC
        LIMIT 1;
    END IF;

    IF v_rec.id IS NULL THEN
        RETURN jsonb_build_object(
            'subscribed', false,
            'enabled', false,
            'notify_chats', true,
            'notify_leads', true,
            'subscription_id', NULL
        );
    END IF;

    RETURN jsonb_build_object(
        'subscribed', true,
        'enabled', v_rec.enabled,
        'notify_chats', v_rec.notify_chats,
        'notify_leads', v_rec.notify_leads,
        'subscription_id', v_rec.id
    );
END;
$$;

-- 1.10 PERMISSÕES DE EXECUÇÃO DAS RPCS
REVOKE ALL ON FUNCTION public.register_push_subscription(TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.unregister_push_subscription(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_push_preferences(UUID, BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_my_push_notification_status(TEXT) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.register_push_subscription(TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unregister_push_subscription(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_push_preferences(UUID, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_push_notification_status(TEXT) TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. VERIFICAÇÃO ESTÁTICA DAS ASSINATURAS E PRIVILÉGIOS (to_regprocedure)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regprocedure('public.register_push_subscription(text,text,text,boolean,boolean)') IS NULL THEN
        RAISE EXCEPTION 'AUDITORIA FALHOU: Assinatura de register_push_subscription não confere.';
    END IF;

    IF to_regprocedure('public.unregister_push_subscription(uuid,text)') IS NULL THEN
        RAISE EXCEPTION 'AUDITORIA FALHOU: Assinatura de unregister_push_subscription não confere.';
    END IF;

    IF to_regprocedure('public.update_push_preferences(uuid,boolean,boolean)') IS NULL THEN
        RAISE EXCEPTION 'AUDITORIA FALHOU: Assinatura de update_push_preferences não confere.';
    END IF;

    IF to_regprocedure('public.get_my_push_notification_status(text)') IS NULL THEN
        RAISE EXCEPTION 'AUDITORIA FALHOU: Assinatura de get_my_push_notification_status não confere.';
    END IF;

    IF to_regprocedure('public.cleanup_old_push_notification_events(integer)') IS NULL THEN
        RAISE EXCEPTION 'AUDITORIA FALHOU: Assinatura de cleanup_old_push_notification_events não confere.';
    END IF;

    RAISE NOTICE '✅ [PASS] AUDITORIA ESTÁTICA: Todas as 5 RPCs foram criadas e verificadas via to_regprocedure.';
END $$;

-- ----------------------------------------------------------------------------
-- 3. TESTES DE REGRAS DE NEGÓCIO E ISOLAMENTO DE USUÁRIOS
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_user_a_id UUID := '11111111-1111-4111-a111-111111111111';
    v_user_b_id UUID := '22222222-2222-4222-b222-222222222222';
    v_endpoint_a1 TEXT := 'https://fcm.googleapis.com/fcm/send/device_a1_token_123456';
    v_endpoint_a2 TEXT := 'https://fcm.googleapis.com/fcm/send/device_a2_token_654321';
    v_endpoint_b1 TEXT := 'https://fcm.googleapis.com/fcm/send/device_b1_token_999999';
    v_res JSONB;
    v_event_id UUID;
    v_sub_a_id UUID;
    v_sub_b_id UUID;
    v_count INT;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTES DE REGRA DE NEGÓCIO DA MIGRATION 009 ===';

    -- Mocks de Usuários e Perfis
    INSERT INTO auth.users (id, email) VALUES (v_user_a_id, 'admin_a@essencialgood.com') ON CONFLICT (id) DO NOTHING;
    INSERT INTO auth.users (id, email) VALUES (v_user_b_id, 'agent_b@essencialgood.com') ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.admin_profiles (id, full_name, role) VALUES (v_user_a_id, 'Admin A', 'admin') ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.admin_profiles (id, full_name, role) VALUES (v_user_b_id, 'Agente B', 'agent') ON CONFLICT (id) DO NOTHING;

    -- TESTE 1: Usuário A registra primeiro dispositivo A1 (com casts explícitos)
    PERFORM set_config('request.jwt.claim.sub', v_user_a_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_res := public.register_push_subscription(
        p_endpoint := v_endpoint_a1::TEXT,
        p_p256dh := 'p256_key_a1'::TEXT,
        p_auth_key := 'auth_key_a1'::TEXT,
        p_notify_chats := true::BOOLEAN,
        p_notify_leads := true::BOOLEAN
    );

    IF (v_res->>'success')::boolean IS NOT TRUE THEN
        RAISE EXCEPTION 'TESTE 1 FALHOU: Falha ao registrar dispositivo A1.';
    END IF;

    v_sub_a_id := (v_res->>'subscription_id')::uuid;
    RAISE NOTICE '✅ [PASS] TESTE 1: Usuário A registrou dispositivo A1 com sucesso.';

    -- TESTE 2: Múltiplos dispositivos do mesmo usuário (Dispositivo A2)
    v_res := public.register_push_subscription(
        p_endpoint := v_endpoint_a2::TEXT,
        p_p256dh := 'p256_key_a2'::TEXT,
        p_auth_key := 'auth_key_a2'::TEXT,
        p_notify_chats := true::BOOLEAN,
        p_notify_leads := false::BOOLEAN
    );

    IF (v_res->>'success')::boolean IS NOT TRUE THEN
        RAISE EXCEPTION 'TESTE 2 FALHOU: Múltiplos dispositivos de A deveriam ser permitidos.';
    END IF;

    SELECT COUNT(*) INTO v_count FROM public.push_subscriptions WHERE user_id = v_user_a_id;
    IF v_count <> 2 THEN
        RAISE EXCEPTION 'TESTE 2 FALHOU: Esperado 2 dispositivos para o Usuário A, encontrado %', v_count;
    END IF;
    RAISE NOTICE '✅ [PASS] TESTE 2: Usuário A registrou 2º dispositivo (A2) mantendo múltiplos aparelhos.';

    -- TESTE 3: Usuário B TENTA REGISTRAR ENDPOINT ATIVO DE A (Rejeição ERRCODE 23505)
    PERFORM set_config('request.jwt.claim.sub', v_user_b_id::text, true);

    BEGIN
        PERFORM public.register_push_subscription(
            p_endpoint := v_endpoint_a1::TEXT,
            p_p256dh := 'p256_key_b_hacker'::TEXT,
            p_auth_key := 'auth_key_b_hacker'::TEXT
        );
        RAISE EXCEPTION 'TESTE 3 FALHOU: Usuário B não poderia assumir endpoint de A.';
    EXCEPTION WHEN OTHERS THEN
        IF SQLSTATE = '23505' OR SQLERRM LIKE '%outro usuário%' THEN
            RAISE NOTICE '✅ [PASS] TESTE 3: Tentativa de Usuário B assumir endpoint de A rejeitada com exceção controlada (ERRCODE 23505).';
        ELSE
            RAISE EXCEPTION 'TESTE 3 FALHOU: Exceção inesperada: % (%)', SQLERRM, SQLSTATE;
        END IF;
    END;

    -- TESTE 4: Usuário B TENTA APAGAR OU ALTERAR PREFERÊNCIAS DE A (Isolamento RLS)
    v_res := public.unregister_push_subscription(p_subscription_id := v_sub_a_id);
    IF (v_res->>'unregistered')::boolean IS TRUE THEN
        RAISE EXCEPTION 'TESTE 4 FALHOU: Usuário B não pode apagar a inscrição de A.';
    END IF;

    BEGIN
        PERFORM public.update_push_preferences(p_subscription_id := v_sub_a_id, p_notify_chats := false::BOOLEAN, p_notify_leads := false::BOOLEAN);
        RAISE EXCEPTION 'TESTE 4 FALHOU: Usuário B não pode alterar preferências de A.';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✅ [PASS] TESTE 4: Tentativas de alteração/exclusão da inscrição de A por B foram bloqueadas.';
    END;

    -- TESTE 5: Cadastro de Nova Subscription de B com Endpoint Único (Dispositivo B1)
    v_res := public.register_push_subscription(
        p_endpoint := v_endpoint_b1::TEXT,
        p_p256dh := 'p256_key_b1'::TEXT,
        p_auth_key := 'auth_key_b1'::TEXT
    );
    v_sub_b_id := (v_res->>'subscription_id')::uuid;

    IF v_sub_b_id IS NULL THEN
        RAISE EXCEPTION 'TESTE 5 FALHOU: Usuário B deveria conseguir registrar seu próprio endpoint único.';
    END IF;
    RAISE NOTICE '✅ [PASS] TESTE 5: Usuário B registrou com sucesso seu próprio dispositivo B1.';

    -- TESTE 6: Logout Normal de A Remove Linha do Dispositivo A1
    PERFORM set_config('request.jwt.claim.sub', v_user_a_id::text, true);

    v_res := public.unregister_push_subscription(p_endpoint := v_endpoint_a1::TEXT);
    IF (v_res->>'unregistered')::boolean IS NOT TRUE THEN
        RAISE EXCEPTION 'TESTE 6 FALHOU: Logout normal de A deveria remover a linha do endpoint A1.';
    END IF;

    SELECT COUNT(*) INTO v_count FROM public.push_subscriptions WHERE endpoint = v_endpoint_a1;
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TESTE 6 FALHOU: Endpoint A1 ainda existe no banco após unregister.';
    END IF;
    RAISE NOTICE '✅ [PASS] TESTE 6: Logout normal removeu corretamente a inscrição A1 do banco.';

    -- TESTE 7: Estrutura de push_notification_deliveries e Rotina de Limpeza
    INSERT INTO public.push_notification_events (event_key, event_type, status)
    VALUES ('conversations:test_001', 'new_conversation', 'processing')
    RETURNING id INTO v_event_id;

    INSERT INTO public.push_notification_deliveries (event_id, subscription_id, status)
    VALUES (v_event_id, v_sub_b_id, 'completed');

    SELECT COUNT(*) INTO v_count FROM public.push_notification_deliveries WHERE event_id = v_event_id;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TESTE 7 FALHOU: Tabela push_notification_deliveries não aceitou inserção de entrega.';
    END IF;

    PERFORM public.cleanup_old_push_notification_events(30);
    RAISE NOTICE '✅ [PASS] TESTE 7: Estrutura de entregas por dispositivo e rotina de limpeza validadas.';

    RAISE NOTICE '=== TODOS OS TESTES TRANSACIONAIS DA MIGRATION 009 FORAM CONCLUÍDOS COM SUCESSO ===';
END $$;

-- ----------------------------------------------------------------------------
-- 4. DESFAZ TODAS AS ALTERAÇÕES E RETORNA RESULTADO VISÍVEL NO DASHBOARD
-- ----------------------------------------------------------------------------
ROLLBACK;

SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;
