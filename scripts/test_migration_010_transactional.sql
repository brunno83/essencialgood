-- ============================================================================
-- ESSENCIAL GOOD - TRANSACTIONAL TEST SUITE FOR MIGRATION 010 (REVOKED PUBLIC EXECUTE & SOFT-DEACTIVATION)
-- Totalmente autocontido. Executa todos os testes dentro de uma transação com ROLLBACK.
-- ============================================================================

BEGIN;

DO $$
DECLARE
  v_res RECORD;
  v_clean_count INT;
  v_conv1 JSONB;
  v_conv2 JSONB;
  v_msg JSONB;
  v_visitor1_id UUID := '11111111-1111-4111-8111-111111111111';
  v_visitor2_id UUID := '22222222-2222-4222-8222-222222222222';
  v_conv1_id UUID;
  v_enabled_sub_count INT;
  v_total_sub_count INT;
  v_target_sub_id UUID;
  i INT;
  v_grant_count INT;
  v_sr_grant_count INT;
  v_long_key VARCHAR(250);
BEGIN
  RAISE NOTICE '=== 1. TESTANDO CONSUME_RATE_LIMIT (FIXED WINDOW DUAL WINDOW & INCONSISTÊNCIA) ===';

  -- Teste 1.1: Consumo normal dentro da capacidade (capacidade = 3, janela = 60s)
  SELECT allowed, retry_after_seconds INTO v_res
  FROM public.consume_rate_limit('test_bucket_1', 'unit_test', 3, 60);

  IF v_res.allowed IS NOT TRUE OR v_res.retry_after_seconds <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Primeira requisição do rate limit deveria ser permitida.';
  END IF;

  PERFORM public.consume_rate_limit('test_bucket_1', 'unit_test', 3, 60);
  PERFORM public.consume_rate_limit('test_bucket_1', 'unit_test', 3, 60);

  -- Teste 1.2: Quarta requisição deve estourar a capacidade e retornar allowed = false e retry_after > 0
  SELECT allowed, retry_after_seconds INTO v_res
  FROM public.consume_rate_limit('test_bucket_1', 'unit_test', 3, 60);

  IF v_res.allowed IS NOT FALSE OR v_res.retry_after_seconds <= 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Requisição acima da capacidade deveria ser bloqueada com retry_after > 0.';
  END IF;

  RAISE NOTICE '✅ [PASS] consume_rate_limit bloqueia requisições acima do limite atômico.';

  -- Teste 1.3: Rejeição de inconsistência na configuração do mesmo bucket
  BEGIN
    PERFORM public.consume_rate_limit('test_bucket_1', 'unit_test', 10, 60);
    RAISE EXCEPTION 'TEST FAILED: Divergência de capacidade deveria ter gerado erro 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] consume_rate_limit rejeita inconsistência de parâmetros no mesmo bucket com erro 22023.';
  END;

  -- Teste 1.4: Rejeição de chave excede 220 caracteres
  v_long_key := repeat('a', 230);
  BEGIN
    PERFORM public.consume_rate_limit(v_long_key, 'unit_test', 3, 60);
    RAISE EXCEPTION 'TEST FAILED: Chave com mais de 220 caracteres deveria falhar com erro 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] consume_rate_limit rejeita chaves que excedem o limite de 220 caracteres com erro 22023.';
  END;

  -- Teste 1.5: Limpeza de buckets expirados
  SELECT public.cleanup_expired_rate_limits() INTO v_clean_count;
  RAISE NOTICE '✅ [PASS] cleanup_expired_rate_limits executado sem erros (% registros expirados limpos).', v_clean_count;

  RAISE NOTICE '=== 2. TESTANDO AUDITORIA DE GRANTS E REVOKES NAS RPCS E TABELA ===';

  -- Verifica se NENHUMA permissão EXECUTE foi concedida a anon ou authenticated nas RPCs
  SELECT COUNT(*) INTO v_grant_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
    AND routine_name IN ('p_create_visitor_conversation', 'p_send_visitor_message', 'consume_rate_limit', 'cleanup_expired_rate_limits')
    AND grantee IN ('PUBLIC', 'anon', 'authenticated');

  IF v_grant_count <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: As novas RPCs possuem permissões indevidas para anon/authenticated/PUBLIC (% encontradas).', v_grant_count;
  END IF;

  -- Verifica se service_role possui acesso de execução explícito
  SELECT COUNT(*) INTO v_sr_grant_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
    AND routine_name IN ('p_create_visitor_conversation', 'p_send_visitor_message', 'consume_rate_limit', 'cleanup_expired_rate_limits')
    AND grantee = 'service_role';

  IF v_sr_grant_count <> 4 THEN
    RAISE EXCEPTION 'TEST FAILED: service_role deve possuir concessão explícita de EXECUTE para todas as 4 RPCs (encontrado: %).', v_sr_grant_count;
  END IF;

  RAISE NOTICE '✅ [PASS] Permissão EXECUTE revogada de anon/authenticated/PUBLIC e concedida explicitamente ao service_role.';

  RAISE NOTICE '=== 3. TESTANDO RPC P_CREATE_VISITOR_CONVERSATION (VIA SERVICE_ROLE COM LOCK ADVISORY) ===';

  v_conv1 := public.p_create_visitor_conversation(v_visitor1_id);
  v_conv1_id := (v_conv1->>'conversation_id')::UUID;

  IF (v_conv1->>'success')::BOOLEAN IS NOT TRUE OR (v_conv1->>'is_existing')::BOOLEAN IS TRUE OR v_conv1_id IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: p_create_visitor_conversation deveria criar nova conversa.';
  END IF;

  v_conv2 := public.p_create_visitor_conversation(v_visitor1_id);

  IF (v_conv2->>'conversation_id')::UUID <> v_conv1_id OR (v_conv2->>'is_existing')::BOOLEAN IS NOT TRUE THEN
    RAISE EXCEPTION 'TEST FAILED: p_create_visitor_conversation deveria ser idempotente e retornar a mesma conversa ativa.';
  END IF;

  RAISE NOTICE '✅ [PASS] p_create_visitor_conversation cria e reutiliza conversa de forma idempotente.';

  RAISE NOTICE '=== 4. TESTANDO RPC P_SEND_VISITOR_MESSAGE (VIA SERVICE_ROLE) ===';

  v_msg := public.p_send_visitor_message(v_visitor1_id, v_conv1_id, 'Mensagem de teste unitário via service_role');

  IF (v_msg->>'sender_type') <> 'visitor' OR (v_msg->>'content') <> 'Mensagem de teste unitário via service_role' THEN
    RAISE EXCEPTION 'TEST FAILED: p_send_visitor_message falhou ao registrar mensagem válida.';
  END IF;

  BEGIN
    PERFORM public.p_send_visitor_message(v_visitor1_id, v_conv1_id, '   ');
    RAISE EXCEPTION 'TEST FAILED: p_send_visitor_message deveria rejeitar conteúdo em branco.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] p_send_visitor_message rejeita mensagens em branco.';
  END;

  BEGIN
    PERFORM public.p_send_visitor_message(v_visitor2_id, v_conv1_id, 'Tentativa de spoofing de conversa alheia');
    RAISE EXCEPTION 'TEST FAILED: p_send_visitor_message deveria rejeitar conversa de outro usuário.';
  EXCEPTION
    WHEN SQLSTATE '42501' THEN
      RAISE NOTICE '✅ [PASS] p_send_visitor_message bloqueia acesso a conversas de terceiros no SQL.';
  END;

  RAISE NOTICE '=== 5. TESTANDO TRIGGER ENFORCE_MAX_PUSH_SUBSCRIPTIONS (DESATIVAÇÃO SUAVE E IMUTABILIDADE DE USER_ID) ===';

  -- Insere 12 assinaturas habilitadas (enabled = true) para o visitante 1
  FOR i IN 1..12 LOOP
    INSERT INTO public.push_subscriptions (
      user_id, endpoint, p256dh, auth, enabled
    ) VALUES (
      v_visitor1_id,
      'https://fcm.googleapis.com/fcm/send/test_sub_' || i,
      'key_' || i,
      'auth_' || i,
      true
    ) RETURNING id INTO v_target_sub_id;
  END LOOP;

  SELECT COUNT(*) INTO v_enabled_sub_count
  FROM public.push_subscriptions
  WHERE user_id = v_visitor1_id AND enabled = true;

  SELECT COUNT(*) INTO v_total_sub_count
  FROM public.push_subscriptions
  WHERE user_id = v_visitor1_id;

  IF v_enabled_sub_count <> 10 THEN
    RAISE EXCEPTION 'TEST FAILED: Assinaturas ATIVAS deveriam ser exatamente 10 (encontrado: %).', v_enabled_sub_count;
  END IF;

  IF v_total_sub_count <> 12 THEN
    RAISE EXCEPTION 'TEST FAILED: Total de assinaturas (incluindo desativadas) deveria ser exatamente 12 (encontrado: %).', v_total_sub_count;
  END IF;

  RAISE NOTICE '✅ [PASS] Trigger desativa suavemente (enabled = false) assinaturas excedentes, mantendo exatamente 10 ativas e preservando os 12 registros.';

  -- Teste de rejeição de alteração de user_id
  BEGIN
    UPDATE public.push_subscriptions
    SET user_id = v_visitor2_id
    WHERE id = v_target_sub_id;
    RAISE EXCEPTION 'TEST FAILED: Alteração de user_id deveria ter falhado com erro 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] Trigger rejeita alteração de user_id com erro 22023.';
  END;

  RAISE NOTICE '=== TODOS OS TESTES TRANSACTIONAIS DA MIGRATION 010 PASSARAM COM SUCESSO! ===';
END;
$$;

ROLLBACK;
