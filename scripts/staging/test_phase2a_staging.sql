-- ============================================================================
-- ESSENCIAL GOOD - STAGING REAL POSTGRESQL SUITE: PHASE 2A RATE LIMIT CORE
-- Target Project Ref: zauvpsxeexwthobmbkku (STAGING ONLY)
-- Safe, Purely Synthetic, Transactional with ROLLBACK
-- ============================================================================

BEGIN;

DO $$
DECLARE
  v_res RECORD;
  v_clean_count INT;
  v_grant_count INT;
  v_sr_grant_count INT;
  v_bucket_a VARCHAR(220) := 'synthetic_test_scope_a:1111111111111111111111111111111111111111111111111111111111111111';
  v_bucket_b VARCHAR(220) := 'synthetic_test_scope_b:2222222222222222222222222222222222222222222222222222222222222222';
  v_win_id BIGINT;
BEGIN
  RAISE NOTICE '=== 1. TESTANDO PERMISSÕES E REVOGATION (GRANTS) DE CONSUME_RATE_LIMIT ===';

  -- 1.1 Confirmar que PUBLIC, anon e authenticated NÃO possuem permissão de execução
  SELECT COUNT(*) INTO v_grant_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
    AND routine_name = 'consume_rate_limit'
    AND grantee IN ('PUBLIC', 'anon', 'authenticated');

  IF v_grant_count <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: consume_rate_limit possui permissões indevidas para anon/authenticated/PUBLIC (% encontradas).', v_grant_count;
  END IF;

  -- 1.2 Confirmar que service_role possui permissão explícita de execução
  SELECT COUNT(*) INTO v_sr_grant_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
    AND routine_name = 'consume_rate_limit'
    AND grantee = 'service_role';

  IF v_sr_grant_count = 0 THEN
    RAISE EXCEPTION 'TEST FAILED: service_role deve possuir permissão EXECUTE em consume_rate_limit.';
  END IF;

  RAISE NOTICE '✅ [PASS] Permissão EXECUTE de consume_rate_limit revogada de anon/authenticated e concedida unicamente ao service_role.';

  RAISE NOTICE '=== 2. TESTANDO NÚCLEO DE RATE LIMITING (SINTÉTICO E ATÔMICO) ===';

  -- 2.1 Primeira requisição permitida (capacidade = 3, janela = 60s)
  SELECT allowed, retry_after_seconds INTO v_res
  FROM public.consume_rate_limit(v_bucket_a, 'unit_test', 3, 60);

  IF v_res.allowed IS NOT TRUE OR v_res.retry_after_seconds <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Primeira requisição sintética deveria ser permitida com retry_after_seconds = 0.';
  END IF;

  RAISE NOTICE '✅ [PASS] Primeira requisição permitida com sucesso (allowed = true, retry_after_seconds = 0).';

  -- Consumo das requisições 2 e 3 dentro da capacidade
  PERFORM public.consume_rate_limit(v_bucket_a, 'unit_test', 3, 60);
  PERFORM public.consume_rate_limit(v_bucket_a, 'unit_test', 3, 60);

  -- 2.2 Quarta requisição (excedente): deve bloquear com allowed = false e retry_after_seconds > 0
  SELECT allowed, retry_after_seconds INTO v_res
  FROM public.consume_rate_limit(v_bucket_a, 'unit_test', 3, 60);

  IF v_res.allowed IS NOT FALSE THEN
    RAISE EXCEPTION 'TEST FAILED: Requisição excedente (4ª requisição) deveria ter sido bloqueada.';
  END IF;

  IF v_res.retry_after_seconds < 1 OR v_res.retry_after_seconds > 60 THEN
    RAISE EXCEPTION 'TEST FAILED: retry_after_seconds inválido (retornado: %, esperado entre 1 e 60).', v_res.retry_after_seconds;
  END IF;

  RAISE NOTICE '✅ [PASS] Requisição excedente bloqueada corretamente (allowed = false, retry_after_seconds = %s).', v_res.retry_after_seconds;

  -- 2.3 Independência entre duas janelas/buckets sintéticos
  SELECT allowed, retry_after_seconds INTO v_res
  FROM public.consume_rate_limit(v_bucket_b, 'unit_test_b', 3, 60);

  IF v_res.allowed IS NOT TRUE THEN
    RAISE EXCEPTION 'TEST FAILED: Bucket B independente foi indevidamente bloqueado pelo estouro do Bucket A.';
  END IF;

  RAISE NOTICE '✅ [PASS] Independência total mantida entre janelas/buckets sintéticos distintos.';

  RAISE NOTICE '=== 3. TESTANDO VALIDAÇÕES DE PARÂMETROS E REJEIÇÃO DE INCONSISTÊNCIA ===';

  -- 3.1 Rejeição de capacidade divergente na mesma chave (SQLSTATE 22023)
  BEGIN
    PERFORM public.consume_rate_limit(v_bucket_a, 'unit_test', 10, 60);
    RAISE EXCEPTION 'TEST FAILED: Alteração de capacidade na mesma chave deveria ter falhado com 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] Divergência de p_capacity na mesma chave rejeitada com SQLSTATE 22023.';
  END;

  -- 3.2 Rejeição de escopo divergente na mesma chave (SQLSTATE 22023)
  BEGIN
    PERFORM public.consume_rate_limit(v_bucket_a, 'different_scope', 3, 60);
    RAISE EXCEPTION 'TEST FAILED: Alteração de escopo na mesma chave deveria ter falhado com 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] Divergência de p_scope na mesma chave rejeitada com SQLSTATE 22023.';
  END;

  -- 3.3 Rejeição de window_seconds divergente na mesma chave (SQLSTATE 22023)
  v_win_id := EXTRACT(EPOCH FROM now())::BIGINT / 120;
  INSERT INTO public.security_rate_limits (
    bucket_key, scope, request_count, max_capacity, window_seconds, window_started_at, expires_at, created_at, updated_at
  ) VALUES (
    'synthetic_win_test:' || v_win_id,
    'unit_test', 1, 3, 60, now(), now() + interval '60 seconds', now(), now()
  );

  BEGIN
    PERFORM public.consume_rate_limit('synthetic_win_test', 'unit_test', 3, 120);
    RAISE EXCEPTION 'TEST FAILED: Divergência de window_seconds na mesma chave deveria ter falhado com 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] Divergência de p_window_seconds na mesma chave rejeitada com SQLSTATE 22023.';
  END;

  -- 3.4 Rejeição de chave vazia ou nula (SQLSTATE 22023)
  BEGIN
    PERFORM public.consume_rate_limit('   ', 'unit_test', 3, 60);
    RAISE EXCEPTION 'TEST FAILED: Chave em branco deveria ter falhado com 22023.';
  EXCEPTION
    WHEN SQLSTATE '22023' THEN
      RAISE NOTICE '✅ [PASS] Chave de bucket em branco rejeitada com SQLSTATE 22023.';
  END;

  -- 3.5 Limpeza de buckets expirados no passado
  INSERT INTO public.security_rate_limits (
    bucket_key, scope, request_count, max_capacity, window_seconds, window_started_at, expires_at, created_at, updated_at
  ) VALUES (
    'synthetic_expired_key_test:9999999',
    'unit_test', 1, 3, 60, now() - interval '2 minutes', now() - interval '1 minute', now() - interval '2 minutes', now() - interval '2 minutes'
  );

  SELECT public.cleanup_expired_rate_limits() INTO v_clean_count;

  IF v_clean_count < 1 THEN
    RAISE EXCEPTION 'TEST FAILED: cleanup_expired_rate_limits deveria ter removido pelo menos 1 registro expirado (retornado: %).', v_clean_count;
  END IF;

  RAISE NOTICE '✅ [PASS] cleanup_expired_rate_limits removeu os registros expirados com sucesso (% removido(s)).', v_clean_count;

  RAISE NOTICE '=== TODOS OS TESTES TRANSACTIONAIS DO NÚCLEO DE RATE LIMIT PASSARAM COM SUCESSO! ===';
END;
$$;

ROLLBACK;
