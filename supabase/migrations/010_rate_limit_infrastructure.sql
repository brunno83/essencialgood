-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 010: RATE LIMIT & SECURE SERVICE-ROLE PROCEDURES
-- ============================================================================

-- 1. TABELA DE JANELAS DE RATE LIMIT (SEM PII, PRIVADA PARA SERVICE_ROLE)
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  bucket_key VARCHAR(220) PRIMARY KEY,
  scope VARCHAR(64) NOT NULL,
  request_count INT NOT NULL DEFAULT 1,
  max_capacity INT NOT NULL,
  window_seconds INT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_bucket_key_no_empty CHECK (length(trim(bucket_key)) > 0),
  CONSTRAINT chk_bucket_key_length CHECK (length(bucket_key) <= 220),
  CONSTRAINT chk_scope_no_empty CHECK (length(trim(scope)) > 0),
  CONSTRAINT chk_capacity_positive CHECK (max_capacity > 0),
  CONSTRAINT chk_window_positive CHECK (window_seconds > 0),
  CONSTRAINT chk_count_positive CHECK (request_count >= 1)
);

CREATE INDEX IF NOT EXISTS idx_security_rate_limits_expires ON public.security_rate_limits(expires_at);

ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.security_rate_limits FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_rate_limits TO service_role;

-- 2. FUNÇÃO ATÔMICA CONSUME_RATE_LIMIT (FIXED WINDOW DUAL-WINDOW SUPPORT)
CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_bucket_key VARCHAR(220),
  p_scope VARCHAR(64),
  p_capacity INT,
  p_window_seconds INT
)
RETURNS TABLE (
  allowed BOOLEAN,
  retry_after_seconds INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_epoch_sec BIGINT;
  v_window_id BIGINT;
  v_window_started_epoch BIGINT;
  v_window_end_epoch BIGINT;
  v_window_started_at TIMESTAMPTZ;
  v_expires_at TIMESTAMPTZ;
  v_full_key VARCHAR(220);
  v_count INT;
  v_clean_scope VARCHAR(64);
  v_retry_after INT;
  v_curr_scope VARCHAR(64);
  v_curr_capacity INT;
  v_curr_window_seconds INT;
  v_curr_count INT;
BEGIN
  IF p_bucket_key IS NULL OR length(trim(p_bucket_key)) = 0 THEN
    RAISE EXCEPTION 'Parâmetro p_bucket_key inválido.' USING ERRCODE = '22023';
  END IF;

  IF length(trim(p_bucket_key)) > 220 THEN
    RAISE EXCEPTION 'Tamanho de p_bucket_key excede o limite máximo permitido de 220 caracteres.' USING ERRCODE = '22023';
  END IF;

  v_clean_scope := COALESCE(NULLIF(trim(p_scope), ''), 'global');

  IF p_capacity IS NULL OR p_capacity <= 0 THEN
    RAISE EXCEPTION 'Parâmetro p_capacity deve ser maior que zero.' USING ERRCODE = '22023';
  END IF;

  IF p_window_seconds IS NULL OR p_window_seconds <= 0 THEN
    RAISE EXCEPTION 'Parâmetro p_window_seconds deve ser maior que zero.' USING ERRCODE = '22023';
  END IF;

  v_epoch_sec := EXTRACT(EPOCH FROM v_now)::BIGINT;
  v_window_id := v_epoch_sec / p_window_seconds;
  v_window_started_epoch := v_window_id * p_window_seconds;
  v_window_end_epoch := (v_window_id + 1) * p_window_seconds;

  v_window_started_at := to_timestamp(v_window_started_epoch);
  v_expires_at := to_timestamp(v_window_end_epoch);
  v_full_key := trim(p_bucket_key) || ':' || v_window_id;

  IF length(v_full_key) > 220 THEN
    RAISE EXCEPTION 'Tamanho final do bucket_key excede o limite máximo de 220 caracteres.' USING ERRCODE = '22023';
  END IF;

  SELECT scope, max_capacity, window_seconds, request_count
  INTO v_curr_scope, v_curr_capacity, v_curr_window_seconds, v_curr_count
  FROM public.security_rate_limits
  WHERE bucket_key = v_full_key;

  IF FOUND THEN
    IF v_curr_scope <> v_clean_scope OR v_curr_capacity <> p_capacity OR v_curr_window_seconds <> p_window_seconds THEN
      RAISE EXCEPTION 'Configuração de rate limit inconsistente para a chave %.', v_full_key USING ERRCODE = '22023';
    END IF;

    UPDATE public.security_rate_limits
    SET request_count = LEAST(2147483647, request_count + 1),
        updated_at = v_now
    WHERE bucket_key = v_full_key
    RETURNING request_count INTO v_count;
  ELSE
    BEGIN
      INSERT INTO public.security_rate_limits (
        bucket_key, scope, request_count, max_capacity, window_seconds, window_started_at, expires_at, created_at, updated_at
      ) VALUES (
        v_full_key, v_clean_scope, 1, p_capacity, p_window_seconds, v_window_started_at, v_expires_at, v_now, v_now
      )
      RETURNING request_count INTO v_count;
    EXCEPTION WHEN unique_violation THEN
      SELECT scope, max_capacity, window_seconds INTO v_curr_scope, v_curr_capacity, v_curr_window_seconds
      FROM public.security_rate_limits
      WHERE bucket_key = v_full_key;

      IF v_curr_scope <> v_clean_scope OR v_curr_capacity <> p_capacity OR v_curr_window_seconds <> p_window_seconds THEN
        RAISE EXCEPTION 'Configuração de rate limit inconsistente para a chave %.', v_full_key USING ERRCODE = '22023';
      END IF;

      UPDATE public.security_rate_limits
      SET request_count = LEAST(2147483647, request_count + 1),
          updated_at = v_now
      WHERE bucket_key = v_full_key
      RETURNING request_count INTO v_count;
    END;
  END IF;

  IF v_count <= p_capacity THEN
    RETURN QUERY SELECT true, 0;
  ELSE
    v_retry_after := GREATEST(1, LEAST(p_window_seconds, (v_window_end_epoch - v_epoch_sec)::INT));
    RETURN QUERY SELECT false, v_retry_after;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(VARCHAR, VARCHAR, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(VARCHAR, VARCHAR, INT, INT) TO service_role;

-- 4. FUNÇÃO CLEANUP_EXPIRED_RATE_LIMITS (HOUSEKEEPING DE BUCKETS EXPIRADOS)
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  DELETE FROM public.security_rate_limits
  WHERE expires_at < now();

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_expired_rate_limits() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;

-- 4. RPC DE CRIAÇÃO SEGURA DE CONVERSA (EXECUÇÃO REST RITA A SERVICE_ROLE APÓS JWT DA EDGE FUNCTION)
DROP FUNCTION IF EXISTS public.p_create_visitor_conversation(UUID);

CREATE OR REPLACE FUNCTION public.p_create_visitor_conversation(
  p_visitor_id UUID,
  p_visitor_name TEXT DEFAULT NULL,
  p_visitor_email TEXT DEFAULT NULL,
  p_visitor_phone TEXT DEFAULT NULL,
  p_visitor_country_code TEXT DEFAULT NULL,
  p_visitor_dial_code TEXT DEFAULT NULL,
  p_source_url TEXT DEFAULT NULL,
  p_source_path TEXT DEFAULT NULL,
  p_source_host TEXT DEFAULT NULL,
  p_source_title TEXT DEFAULT NULL,
  p_source_product TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
  v_clean_name TEXT;
  v_clean_email TEXT;
  v_clean_phone TEXT;
  v_clean_country_code TEXT;
  v_clean_dial_code TEXT;
  v_clean_source_url TEXT;
  v_clean_source_path TEXT;
  v_clean_source_host TEXT;
  v_clean_source_title TEXT;
  v_clean_source_product TEXT;
BEGIN
  IF p_visitor_id IS NULL THEN
    RAISE EXCEPTION 'ID do visitante é obrigatório.' USING ERRCODE = '22023';
  END IF;

  v_clean_name := NULLIF(trim(p_visitor_name), '');
  v_clean_email := NULLIF(lower(trim(p_visitor_email)), '');
  v_clean_phone := NULLIF(trim(p_visitor_phone), '');
  v_clean_country_code := NULLIF(upper(trim(p_visitor_country_code)), '');
  v_clean_dial_code := NULLIF(trim(p_visitor_dial_code), '');
  v_clean_source_url := NULLIF(trim(p_source_url), '');
  v_clean_source_path := NULLIF(trim(p_source_path), '');
  v_clean_source_host := NULLIF(lower(trim(p_source_host)), '');
  v_clean_source_title := NULLIF(trim(p_source_title), '');
  v_clean_source_product := NULLIF(lower(trim(p_source_product)), '');

  -- Lock transacional por visitante para garantir idempotência atômica contra requisições concorrentes
  PERFORM pg_advisory_xact_lock(hashtext('conv_lock:' || p_visitor_id::text));

  SELECT c.id INTO v_existing_id
  FROM public.conversations c
  WHERE c.visitor_id = p_visitor_id
    AND c.status IN ('open', 'pending')
  ORDER BY c.created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Atualiza dados de contato apenas se novos valores válidos forem fornecidos
    -- Preserva a origem primária preenchida (COALESCE prioriza o valor existente em c.coluna)
    UPDATE public.conversations c
    SET
      visitor_name = COALESCE(v_clean_name, c.visitor_name),
      visitor_email = COALESCE(v_clean_email, c.visitor_email),
      visitor_phone = COALESCE(v_clean_phone, c.visitor_phone),
      visitor_country_code = COALESCE(v_clean_country_code, c.visitor_country_code),
      visitor_dial_code = COALESCE(v_clean_dial_code, c.visitor_dial_code),
      source_url = COALESCE(c.source_url, v_clean_source_url),
      source_path = COALESCE(c.source_path, v_clean_source_path),
      source_host = COALESCE(c.source_host, v_clean_source_host),
      source_title = COALESCE(c.source_title, v_clean_source_title),
      source_product = COALESCE(c.source_product, v_clean_source_product),
      updated_at = now()
    WHERE c.id = v_existing_id;

    RETURN jsonb_build_object('success', true, 'conversation_id', v_existing_id, 'is_existing', true);
  END IF;

  INSERT INTO public.conversations (
    visitor_id,
    visitor_name,
    visitor_email,
    visitor_phone,
    visitor_country_code,
    visitor_dial_code,
    status,
    source_url,
    source_path,
    source_host,
    source_title,
    source_product
  ) VALUES (
    p_visitor_id,
    v_clean_name,
    v_clean_email,
    v_clean_phone,
    v_clean_country_code,
    v_clean_dial_code,
    'open',
    v_clean_source_url,
    v_clean_source_path,
    v_clean_source_host,
    v_clean_source_title,
    v_clean_source_product
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object('success', true, 'conversation_id', v_new_id, 'is_existing', false);
END;
$$;

REVOKE ALL ON FUNCTION public.p_create_visitor_conversation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.p_create_visitor_conversation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- 5. RPC DE ENVIO SEGURO DE MENSAGEM (EXECUÇÃO REST RITA A SERVICE_ROLE APÓS JWT DA EDGE FUNCTION)
CREATE OR REPLACE FUNCTION public.p_send_visitor_message(
  p_visitor_id UUID,
  p_conversation_id UUID,
  p_content TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_conv_visitor_id UUID;
  v_conv_status TEXT;
  v_clean_content TEXT;
  v_new_msg_id UUID;
  v_created_at TIMESTAMPTZ;
BEGIN
  IF p_visitor_id IS NULL THEN
    RAISE EXCEPTION 'ID do visitante é obrigatório.' USING ERRCODE = '22023';
  END IF;

  IF p_conversation_id IS NULL THEN
    RAISE EXCEPTION 'ID da conversa é obrigatório.' USING ERRCODE = '22023';
  END IF;

  v_clean_content := trim(p_content);
  IF length(v_clean_content) = 0 OR length(v_clean_content) > 4000 THEN
    RAISE EXCEPTION 'Tamanho de mensagem inválido (deve ter entre 1 e 4000 caracteres).' USING ERRCODE = '22023';
  END IF;

  SELECT visitor_id, status INTO v_conv_visitor_id, v_conv_status
  FROM public.conversations
  WHERE id = p_conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversa não encontrada.' USING ERRCODE = 'P0002';
  END IF;

  IF v_conv_visitor_id <> p_visitor_id THEN
    RAISE EXCEPTION 'Acesso negado: Esta conversa pertence a outro visitante.' USING ERRCODE = '42501';
  END IF;

  IF v_conv_status = 'closed' THEN
    RAISE EXCEPTION 'Esta conversa foi encerrada.' USING ERRCODE = '22000';
  END IF;

  INSERT INTO public.messages (conversation_id, sender_id, sender_type, content)
  VALUES (p_conversation_id, p_visitor_id, 'visitor', v_clean_content)
  RETURNING id, created_at INTO v_new_msg_id, v_created_at;

  RETURN jsonb_build_object(
    'id', v_new_msg_id,
    'conversation_id', p_conversation_id,
    'sender_type', 'visitor',
    'content', v_clean_content,
    'created_at', v_created_at
  );
END;
$$;

REVOKE ALL ON FUNCTION public.p_send_visitor_message(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.p_send_visitor_message(UUID, UUID, TEXT) TO service_role;

-- 6. PROTEÇÃO DE PUSH SUBSCRIPTIONS COM SUAVE DESATIVAÇÃO (UPDATE ENABLED = FALSE) E ADVISORY LOCK
-- Preserva histórico e endpoints auditáveis. Limite de no máximo 10 assinaturas ativas simultâneas por usuário.
-- Reativação de assinatura desativada (UPDATE enabled = true) é interceptada e conta contra o limite.
-- Alteração do user_id em registros existentes é estritamente proibida (user_id imutável).
CREATE OR REPLACE FUNCTION public.enforce_max_push_subscriptions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count INT;
  v_now TIMESTAMPTZ := now();
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Alteração de user_id em push_subscriptions não é permitida.' USING ERRCODE = '22023';
  END IF;

  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id é obrigatório.' USING ERRCODE = '22023';
  END IF;

  IF NEW.enabled IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.enabled IS TRUE AND NEW.enabled IS TRUE THEN
    RETURN NEW;
  END IF;

  -- Lock transacional por usuário para prevenir inserções/reativações concorrentes
  PERFORM pg_advisory_xact_lock(hashtext(NEW.user_id::text));

  -- Conta apenas assinaturas atualmente ativas do usuário
  SELECT COUNT(*) INTO v_count
  FROM public.push_subscriptions
  WHERE user_id = NEW.user_id
    AND enabled = true;

  -- Se já existirem 10 ou mais ativas, desativa (enabled = false) as mais antigas excedentes
  IF v_count >= 10 THEN
    UPDATE public.push_subscriptions
    SET enabled = false,
        updated_at = v_now
    WHERE id IN (
      SELECT id FROM public.push_subscriptions
      WHERE user_id = NEW.user_id
        AND enabled = true
      ORDER BY updated_at ASC, created_at ASC
      LIMIT (v_count - 9)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_push_subscriptions_limit ON public.push_subscriptions;
CREATE TRIGGER trg_enforce_push_subscriptions_limit
  BEFORE INSERT OR UPDATE OF enabled, user_id ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_max_push_subscriptions();
