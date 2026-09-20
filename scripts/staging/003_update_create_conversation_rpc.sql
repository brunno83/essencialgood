-- ESSENCIAL GOOD - STAGING PATCH 003: UPDATE CREATE_CONVERSATION RPC SIGNATURE
-- Target Staging Ref: zauvpsxeexwthobmbkku
-- Forbidden Prod Ref: axgpmpnipwyfirlplbjv
-- OBS: A trava SQL abaixo via current_database() eh apenas uma defesa secundaria (current_database() pode retornar 'postgres').
-- A protecao primaria eh garantida exclusivamente pelo wrapper PowerShell via --project-ref.

DO $$
BEGIN
  IF current_database() LIKE '%axgpmpnipwyfirlplbjv%' THEN
    RAISE EXCEPTION 'CRITICAL SECURITY ERROR: Staging patch attempted on Production database!';
  END IF;
END $$;

BEGIN;

-- 1. Remove a assinatura antiga para evitar ambiguidade no PostgREST
DROP FUNCTION IF EXISTS public.p_create_visitor_conversation(UUID);

-- 2. Cria a nova assinatura expandida com metadados de contato e origem
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

  PERFORM pg_advisory_xact_lock(hashtext('conv_lock:' || p_visitor_id::text));

  SELECT c.id INTO v_existing_id
  FROM public.conversations c
  WHERE c.visitor_id = p_visitor_id
    AND c.status IN ('open', 'pending')
  ORDER BY c.created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
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

COMMIT;
