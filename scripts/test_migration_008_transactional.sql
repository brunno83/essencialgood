-- ============================================================================
-- ESSENCIAL GOOD - TESTE TRANSACIONAL DA MIGRATION 008
-- ============================================================================
-- ATENÇÃO: ESTE TESTE É TOTALMENTE AUTOCONTIDO E DEVE SER EXECUTADO NO SQL EDITOR.
-- ELE TERMINA COM ROLLBACK; E NÃO MUTA NENHUM DADO NA BASE REMOTA/PERSISTENTE.
-- ============================================================================

BEGIN;

-- ============================================================================
-- INÍCIO DA MIGRATION 008 (CÓPIA LITERALE DO ARQUIVO LOCAL)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_checkout_lead_admin(
  p_lead_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted_id UUID;
BEGIN
  -- 1. SEGURANÇA CRÍTICA: Apenas autenticados com perfil estrito de admin (agents e anon são bloqueados)
  IF auth.role() <> 'authenticated' OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  -- 2. VALIDAÇÃO ESTRITA DO PARÂMETRO
  IF p_lead_id IS NULL THEN
    RAISE EXCEPTION 'ID do lead é obrigatório.';
  END IF;

  -- 3. EXCLUSÃO INDIVIDUAL EXCLUSIVAMENTE PELO UUID DO LEAD
  DELETE FROM public.checkout_leads
  WHERE id = p_lead_id
  RETURNING id INTO v_deleted_id;

  -- 4. RETORNO CONTROLADO EM CASO DE NÃO ENCONTRADO OU SUCESSO
  IF v_deleted_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Lead não encontrado.'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_id', v_deleted_id
  );
END;
$$;

-- 5. PERMISSÕES ESTRITAS (APENAS AUTHENTICATED COM EXECUTE, REVOGADO DE PUBLIC E ANON)
REVOKE ALL ON FUNCTION public.delete_checkout_lead_admin(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_checkout_lead_admin(UUID) TO authenticated;

-- ============================================================================
-- FIM DA MIGRATION 008
-- ============================================================================

DO $$
DECLARE
  v_real_admin_id UUID;
  v_orig_role TEXT;
  v_no_profile_id UUID := gen_random_uuid();
  v_lead1_id UUID := gen_random_uuid();
  v_lead2_id UUID := gen_random_uuid();
  v_nonexistent_id UUID := gen_random_uuid();
  v_res JSONB;
  v_count INT;
BEGIN
  -- 1. Obter ID e role de um perfil administrativo real existente na tabela public.admin_profiles
  SELECT id, role INTO v_real_admin_id, v_orig_role
  FROM public.admin_profiles
  ORDER BY (CASE WHEN role = 'admin' THEN 1 ELSE 2 END)
  LIMIT 1;

  IF v_real_admin_id IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: Nenhum perfil administrativo encontrado em public.admin_profiles para o teste.';
  END IF;

  -- Ajustar temporariamente o perfil para 'admin' se necessário
  UPDATE public.admin_profiles SET role = 'admin' WHERE id = v_real_admin_id;

  -- 2. Inserção de 2 leads de teste (fixtures) respeitando todas as constraints da Migration 005
  INSERT INTO public.checkout_leads (
    id, created_at, name, email, phone, country_code, dial_code, product, page_type, source_path, checkout_url, consent_given, consent_at
  ) VALUES (
    v_lead1_id, now(), 'Lead Teste Um', 'lead1@teste.com', '+14155550001', 'US', '+1', 'slimsoda', 'adv', '/slimsoda/adv', 'https://cc.slimsodapowder.com/checkout.php?affid=1001', true, now()
  ), (
    v_lead2_id, now(), 'Lead Teste Dois', 'lead2@teste.com', '+14155550002', 'US', '+1', 'sonnus', 'pdp', '/sonnus', 'https://cc.slimsodapowder.com/checkout.php?affid=1002', true, now()
  );

  -- --------------------------------------------------------------------------
  -- A. TESTE DE BLOQUEIO PARA PAPEL ANON
  -- --------------------------------------------------------------------------
  PERFORM set_config('request.jwt.claims', '{"role": "anon"}', true);
  BEGIN
    PERFORM public.delete_checkout_lead_admin(v_lead1_id);
    RAISE EXCEPTION 'TEST FAILED: Role anon deveria ter sido bloqueada.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Access denied%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para anon: %', SQLERRM;
    END IF;
  END;

  -- --------------------------------------------------------------------------
  -- B. TESTE DE BLOQUEIO PARA USUÁRIO AUTENTICADO SEM PERFIL ADMINISTRATIVO
  -- --------------------------------------------------------------------------
  PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', v_no_profile_id)::text, true);
  BEGIN
    PERFORM public.delete_checkout_lead_admin(v_lead1_id);
    RAISE EXCEPTION 'TEST FAILED: Usuário sem perfil deveria ter sido bloqueado.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Access denied%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para usuário sem perfil: %', SQLERRM;
    END IF;
  END;

  -- --------------------------------------------------------------------------
  -- C. TESTE DE BLOQUEIO PARA PAPEL AGENT (alteração temporária do perfil real)
  -- --------------------------------------------------------------------------
  UPDATE public.admin_profiles SET role = 'agent' WHERE id = v_real_admin_id;
  PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', v_real_admin_id)::text, true);

  BEGIN
    PERFORM public.delete_checkout_lead_admin(v_lead1_id);
    RAISE EXCEPTION 'TEST FAILED: Papel agent deveria ter sido bloqueado ao tentar excluir lead.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Access denied%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para papel agent: %', SQLERRM;
    END IF;
  END;

  -- Restaurar perfil para 'admin' para executar os testes de funcionalidade
  UPDATE public.admin_profiles SET role = 'admin' WHERE id = v_real_admin_id;
  PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', v_real_admin_id)::text, true);

  -- --------------------------------------------------------------------------
  -- D. REJEIÇÃO DE PARÂMETRO NULL (p_lead_id IS NULL)
  -- --------------------------------------------------------------------------
  BEGIN
    PERFORM public.delete_checkout_lead_admin(NULL);
    RAISE EXCEPTION 'TEST FAILED: p_lead_id NULL deveria ter sido rejeitado.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%ID do lead é obrigatório%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para NULL: %', SQLERRM;
    END IF;
  END;

  -- --------------------------------------------------------------------------
  -- E. RETORNO CONTROLADO PARA UUID INEXISTENTE
  -- --------------------------------------------------------------------------
  v_res := public.delete_checkout_lead_admin(v_nonexistent_id);
  IF (v_res->>'success')::boolean IS NOT FALSE OR v_res->>'error' IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: Exclusão de UUID inexistente deveria retornar success: false controlado. Retornado: %', v_res;
  END IF;

  -- --------------------------------------------------------------------------
  -- F. EXCLUSÃO COM SUCESSO DO LEAD 1 PELO ADMIN E MANUTENÇÃO DO LEAD 2 INTACTO
  -- --------------------------------------------------------------------------
  v_res := public.delete_checkout_lead_admin(v_lead1_id);
  IF (v_res->>'success')::boolean IS NOT TRUE OR (v_res->>'deleted_id')::uuid <> v_lead1_id THEN
    RAISE EXCEPTION 'TEST FAILED: Retorno de exclusão inválido para o lead1: %', v_res;
  END IF;

  -- Confirmar que o lead1 foi efetivamente removido
  SELECT COUNT(*) INTO v_count FROM public.checkout_leads WHERE id = v_lead1_id;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Lead1 ainda existe na tabela public.checkout_leads após exclusão.';
  END IF;

  -- Confirmar que o lead2 permanece intacto na tabela
  SELECT COUNT(*) INTO v_count FROM public.checkout_leads WHERE id = v_lead2_id;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Lead2 foi incorretamente alterado ou removido.';
  END IF;

  -- Restaurar perfil para o papel original antes de encerrar
  UPDATE public.admin_profiles SET role = v_orig_role WHERE id = v_real_admin_id;

  -- --------------------------------------------------------------------------
  -- G. VERIFICAÇÃO DE PRIVILÉGIOS DE EXECUÇÃO NA TABELA DE SISTEMA
  -- --------------------------------------------------------------------------
  IF NOT has_function_privilege('authenticated', 'public.delete_checkout_lead_admin(UUID)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: authenticated deveria possuir privilégio EXECUTE.';
  END IF;

  IF has_function_privilege('anon', 'public.delete_checkout_lead_admin(UUID)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: anon possui privilégio EXECUTE não autorizado.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) acl
    WHERE n.nspname = 'public'
      AND p.proname = 'delete_checkout_lead_admin'
      AND (
        p.oid = to_regprocedure('public.delete_checkout_lead_admin(UUID)')
        OR pg_get_function_identity_arguments(p.oid) = 'p_lead_id uuid'
      )
      AND acl.grantee = 0
      AND acl.privilege_type = 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'TEST FAILED: PUBLIC possui privilégio EXECUTE não autorizado.';
  END IF;

  RAISE NOTICE 'SUITE COMPLETA DA MIGRATION 008 EXECUTADA COM SUCESSO!';
END;
$$;

ROLLBACK;

SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;
