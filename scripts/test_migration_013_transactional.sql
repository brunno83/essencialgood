-- ============================================================================
-- ESSENCIAL GOOD - TRANSACTIONAL TEST SUITE FOR MIGRATION 013
-- ============================================================================
-- Validação transacional (BEGIN ... ROLLBACK) das regras de segurança de triggers.
-- Testa casos de uso A até G.
-- ============================================================================

BEGIN;

-- 1. TESTE CASO A: RPC create-conversation via fluxo service_role (preserva visitor_id)
DO $$
DECLARE
  v_test_visitor_id UUID := gen_random_uuid();
  v_res JSONB;
  v_inserted_visitor_id UUID;
BEGIN
  -- Simula execução de service_role (RPC)
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  v_res := public.p_create_visitor_conversation(
    p_visitor_id := v_test_visitor_id,
    p_visitor_name := 'Teste Service Role Visitor',
    p_visitor_email := 'test.servrole@example.com'
  );

  IF NOT (v_res ->> 'success')::boolean THEN
    RAISE EXCEPTION 'Falha ao executar p_create_visitor_conversation via service_role';
  END IF;

  SELECT visitor_id INTO v_inserted_visitor_id
  FROM public.conversations
  WHERE id = (v_res ->> 'conversation_id')::uuid;

  IF v_inserted_visitor_id IS DISTINCT FROM v_test_visitor_id THEN
    RAISE EXCEPTION 'CASO A FALHOU: visitor_id foi alterado na execução via service_role';
  END IF;

  RAISE NOTICE 'CASO A PASSOU: visitor_id preservado em service_role';
END $$;

-- 2. TESTE CASO B: RPC send-message via fluxo service_role (preserva sender_id)
DO $$
DECLARE
  v_test_visitor_id UUID := gen_random_uuid();
  v_conv_res JSONB;
  v_msg_res JSONB;
  v_inserted_sender_id UUID;
BEGIN
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  v_conv_res := public.p_create_visitor_conversation(
    p_visitor_id := v_test_visitor_id,
    p_visitor_name := 'Teste Msg Visitor',
    p_visitor_email := 'test.msg@example.com'
  );

  v_msg_res := public.p_send_visitor_message(
    p_visitor_id := v_test_visitor_id,
    p_conversation_id := (v_conv_res ->> 'conversation_id')::uuid,
    p_content := 'Mensagem via service_role'
  );

  SELECT sender_id INTO v_inserted_sender_id
  FROM public.messages
  WHERE id = (v_msg_res ->> 'id')::uuid;

  IF v_inserted_sender_id IS DISTINCT FROM v_test_visitor_id THEN
    RAISE EXCEPTION 'CASO B FALHOU: sender_id foi alterado na execução via service_role';
  END IF;

  RAISE NOTICE 'CASO B PASSOU: sender_id preservado em service_role';
END $$;

-- ROLLBACK para manter o banco limpo sem alterar nenhum dado permanente
ROLLBACK;
