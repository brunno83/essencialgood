-- ESSENCIAL GOOD - STAGING ROLLBACK 003: RESTORE SINGLE-PARAMETER CREATE_CONVERSATION RPC SIGNATURE
-- Target Staging Ref: zauvpsxeexwthobmbkku
-- Forbidden Prod Ref: axgpmpnipwyfirlplbjv
-- OBS: A trava SQL abaixo via current_database() eh apenas uma defesa secundaria.
-- A protecao primaria eh garantida exclusivamente pelo wrapper PowerShell via --project-ref.

DO $$
BEGIN
  IF current_database() LIKE '%axgpmpnipwyfirlplbjv%' THEN
    RAISE EXCEPTION 'CRITICAL SECURITY ERROR: Staging rollback attempted on Production database!';
  END IF;
END $$;

BEGIN;

-- 1. Remove a assinatura expandida de 11 parâmetros
DROP FUNCTION IF EXISTS public.p_create_visitor_conversation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

-- 2. Restaura a assinatura original de 1 parâmetro (UUID) exatamente conforme c008de2
CREATE OR REPLACE FUNCTION public.p_create_visitor_conversation(
  p_visitor_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  IF p_visitor_id IS NULL THEN
    RAISE EXCEPTION 'ID do visitante é obrigatório.' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('conv_lock:' || p_visitor_id::text));

  SELECT id INTO v_existing_id
  FROM public.conversations
  WHERE visitor_id = p_visitor_id
    AND status IN ('open', 'pending')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'conversation_id', v_existing_id, 'is_existing', true);
  END IF;

  INSERT INTO public.conversations (visitor_id, status)
  VALUES (p_visitor_id, 'open')
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object('success', true, 'conversation_id', v_new_id, 'is_existing', false);
END;
$$;

REVOKE ALL ON FUNCTION public.p_create_visitor_conversation(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.p_create_visitor_conversation(UUID) TO service_role;

COMMIT;
