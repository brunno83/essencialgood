-- ============================================================================
-- ESSENCIAL GOOD - TESTE TRANSACIONAL DA MIGRATION 007
-- ============================================================================
-- ATENÇÃO: ESTE TESTE É TOTALMENTE AUTOCONTIDO E DEVE SER EXECUTADO NO SQL EDITOR.
-- ELE TERMINA COM ROLLBACK; E NÃO MUTA NENHUM DADO NA BASE REMOTA/PERSISTENTE.
-- ============================================================================

BEGIN;

-- ============================================================================
-- INÍCIO DA MIGRATION 007 (CÓPIA LITERALE DO ARQUIVO REMOTO/LOCAL)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_checkout_leads_admin(
  p_page INT DEFAULT 1,
  p_page_size INT DEFAULT 20,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL,
  p_product TEXT DEFAULT 'all',
  p_page_type TEXT DEFAULT 'all',
  p_search TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_page INT;
  v_page_size INT;
  v_prod_filter TEXT;
  v_page_filter TEXT;
  v_search_filter TEXT;
  v_escaped_search TEXT;
  v_offset INT;

  v_total_items BIGINT := 0;
  v_total_pages INT := 0;
  v_items_json JSONB := '[]'::jsonb;
  v_result JSONB;
BEGIN
  -- 1. SEGURANÇA CRÍTICA: Apenas autenticados com perfil admin ou agent
  IF auth.role() <> 'authenticated' OR NOT public.is_admin_or_agent() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  -- 2. VALIDAÇÃO E NORMALIZAÇÃO ESTRITA DOS PARÂMETROS
  IF p_page IS NULL OR p_page < 1 THEN
    RAISE EXCEPTION 'Página inválida: %', p_page;
  END IF;

  IF p_page_size IS NULL OR p_page_size < 1 OR p_page_size > 100 THEN
    RAISE EXCEPTION 'Tamanho de página inválido: %', p_page_size;
  END IF;

  v_page := p_page;
  v_page_size := p_page_size;
  v_offset := (v_page - 1) * v_page_size;

  v_prod_filter := lower(trim(COALESCE(p_product, 'all')));
  v_page_filter := lower(trim(COALESCE(p_page_type, 'all')));
  v_search_filter := trim(COALESCE(p_search, ''));

  IF char_length(v_search_filter) > 100 THEN
    RAISE EXCEPTION 'Termo de busca muito longo.';
  END IF;

  IF v_prod_filter NOT IN ('all', 'slimsoda', 'sonnus', 'crowned', 'linfaflow', 'memoflow') THEN
    RAISE EXCEPTION 'Produto inválido: %', p_product;
  END IF;

  IF v_page_filter NOT IN ('all', 'pdp', 'listicle', 'adv', 'power') THEN
    RAISE EXCEPTION 'Tipo de página inválido: %', p_page_type;
  END IF;

  IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL AND p_start_date >= p_end_date THEN
    RAISE EXCEPTION 'Data inicial deve ser anterior à data final.';
  END IF;

  -- 3. ESCAPE SEGURO DOS CARACTERES ESPECIAIS DE BUSCA ILIKE (\, %, _)
  IF v_search_filter <> '' THEN
    v_escaped_search := replace(replace(replace(v_search_filter, '\', '\\'), '%', '\%'), '_', '\_');
  ELSE
    v_escaped_search := '';
  END IF;

  -- 4. CONTAGEM TOTAL DE REGISTROS (TOTAL_ITEMS)
  SELECT COUNT(*) INTO v_total_items
  FROM public.checkout_leads l
  WHERE (p_start_date IS NULL OR l.created_at >= p_start_date)
    AND (p_end_date IS NULL OR l.created_at < p_end_date)
    AND (v_prod_filter = 'all' OR l.product = v_prod_filter)
    AND (v_page_filter = 'all' OR l.page_type = v_page_filter)
    AND (
      v_search_filter = '' OR
      l.name ILIKE '%' || v_escaped_search || '%' ESCAPE '\' OR
      l.email ILIKE '%' || v_escaped_search || '%' ESCAPE '\' OR
      l.phone ILIKE '%' || v_escaped_search || '%' ESCAPE '\'
    );

  -- 5. CÁLCULO DE TOTAL DE PÁGINAS
  IF v_total_items > 0 THEN
    v_total_pages := CEIL(v_total_items::NUMERIC / v_page_size::NUMERIC)::INT;
  ELSE
    v_total_pages := 0;
  END IF;

  -- 6. SELEÇÃO DOS ITENS PAGINADOS (INCLUI CHECKOUT_URL APENAS PARA RECUPERAÇÃO DE VENDAS)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', l.id,
      'created_at', l.created_at,
      'name', l.name,
      'email', l.email,
      'phone', l.phone,
      'country_code', l.country_code,
      'dial_code', l.dial_code,
      'product', l.product,
      'page_type', l.page_type,
      'page_title', l.page_title,
      'source_path', l.source_path,
      'checkout_url', l.checkout_url,
      'consent_given', l.consent_given,
      'consent_at', l.consent_at
    )
  ), '[]'::jsonb) INTO v_items_json
  FROM (
    SELECT *
    FROM public.checkout_leads l
    WHERE (p_start_date IS NULL OR l.created_at >= p_start_date)
      AND (p_end_date IS NULL OR l.created_at < p_end_date)
      AND (v_prod_filter = 'all' OR l.product = v_prod_filter)
      AND (v_page_filter = 'all' OR l.page_type = v_page_filter)
      AND (
        v_search_filter = '' OR
        l.name ILIKE '%' || v_escaped_search || '%' ESCAPE '\' OR
        l.email ILIKE '%' || v_escaped_search || '%' ESCAPE '\' OR
        l.phone ILIKE '%' || v_escaped_search || '%' ESCAPE '\'
      )
    ORDER BY l.created_at DESC
    LIMIT v_page_size
    OFFSET v_offset
  ) l;

  -- 7. ESTRUTURA DE RETORNO UNIFICADA E PADRONIZADA
  v_result := jsonb_build_object(
    'items', v_items_json,
    'pagination', jsonb_build_object(
      'page', v_page,
      'page_size', v_page_size,
      'total_items', v_total_items,
      'total_pages', v_total_pages
    )
  );

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- FIM DA MIGRATION 007
-- ============================================================================

-- CONTEXTO DE TESTE COM USUÁRIOS REAIS DE ADMIN_PROFILES
CREATE TEMP TABLE tmp_migration_007_test_context (
  admin_id UUID,
  agent_id UUID
) ON COMMIT DROP;

INSERT INTO tmp_migration_007_test_context (admin_id, agent_id)
SELECT
  (SELECT id FROM public.admin_profiles WHERE role = 'admin' LIMIT 1),
  (SELECT id FROM public.admin_profiles WHERE role = 'agent' LIMIT 1);

DO $$
DECLARE
  v_admin_id UUID;
  v_agent_id UUID;
  v_res JSONB;
  v_first_item JSONB;
  i INT;
  v_phone TEXT;
  v_email TEXT;
  v_product TEXT;
  v_page_type TEXT;
  v_now TIMESTAMPTZ := now();
BEGIN
  SELECT admin_id, agent_id INTO v_admin_id, v_agent_id FROM tmp_migration_007_test_context;
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: Nenhum usuário admin encontrado na tabela public.admin_profiles.';
  END IF;

  -- --------------------------------------------------------------------------
  -- 1. TESTE DE BLOQUEIO PARA ANON
  -- --------------------------------------------------------------------------
  PERFORM set_config('request.jwt.claims', '{"role": "anon"}', true);
  BEGIN
    PERFORM public.get_checkout_leads_admin();
    RAISE EXCEPTION 'TEST FAILED: Role anon deveria ter sido bloqueada.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Access denied%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para anon: %', SQLERRM;
    END IF;
  END;

  -- --------------------------------------------------------------------------
  -- 2. TESTE DE BLOQUEIO PARA AUTHENTICATED SEM PERFIL ADMIN/AGENT
  -- --------------------------------------------------------------------------
  PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', gen_random_uuid())::text, true);
  BEGIN
    PERFORM public.get_checkout_leads_admin();
    RAISE EXCEPTION 'TEST FAILED: Authenticated sem perfil admin/agent deveria ser bloqueado.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Access denied%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para authenticated sem perfil: %', SQLERRM;
    END IF;
  END;

  -- SIMULAÇÃO COMO ADMIN AUTENTICADO REAL
  PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', v_admin_id)::text, true);

  -- --------------------------------------------------------------------------
  -- 3. TESTE PARA BANCO VAZIO
  -- --------------------------------------------------------------------------
  v_res := public.get_checkout_leads_admin();
  IF (v_res->'pagination'->>'total_items')::INT <> 0 OR
     (v_res->'pagination'->>'total_pages')::INT <> 0 OR
     jsonb_array_length(v_res->'items') <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Retorno para base vazia incorreto: %', v_res;
  END IF;

  -- --------------------------------------------------------------------------
  -- 4. VALIDAÇÕES DE PARÂMETROS DA RPC (PAGE, PAGE_SIZE, SEARCH LENGTH, START >= END)
  -- --------------------------------------------------------------------------
  -- PAGE INVÁLIDA (< 1)
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_page => 0);
    RAISE EXCEPTION 'TEST FAILED: p_page < 1 deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Página inválida%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para p_page < 1: %', SQLERRM;
    END IF;
  END;

  -- PAGE_SIZE INVÁLIDO (< 1)
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_page_size => 0);
    RAISE EXCEPTION 'TEST FAILED: p_page_size < 1 deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Tamanho de página inválido%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para p_page_size < 1: %', SQLERRM;
    END IF;
  END;

  -- PAGE_SIZE INVÁLIDO (> 100)
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_page_size => 101);
    RAISE EXCEPTION 'TEST FAILED: p_page_size > 100 deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Tamanho de página inválido%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para p_page_size > 100: %', SQLERRM;
    END IF;
  END;

  -- PRODUTO INVÁLIDO
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_product => 'produto_ficticio');
    RAISE EXCEPTION 'TEST FAILED: p_product inválido deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Produto inválido%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para p_product inválido: %', SQLERRM;
    END IF;
  END;

  -- TIPO DE PÁGINA INVÁLIDO
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_page_type => 'tipo_ficticio');
    RAISE EXCEPTION 'TEST FAILED: p_page_type inválido deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Tipo de página inválido%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para p_page_type inválido: %', SQLERRM;
    END IF;
  END;

  -- DATA INICIAL >= DATA FINAL
  BEGIN
    PERFORM public.get_checkout_leads_admin(p_start_date => v_now, p_end_date => v_now - INTERVAL '1 hour');
    RAISE EXCEPTION 'TEST FAILED: p_start_date >= p_end_date deveria ter disparado exception.';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%Data inicial deve ser anterior%' THEN
      RAISE EXCEPTION 'TEST FAILED: Mensagem inesperada para datas inválidas: %', SQLERRM;
    END IF;
  END;

  -- --------------------------------------------------------------------------
  -- POPULAÇÃO DE FIXTURES (25 LEADS PADRÃO + 1 LEAD COM CARACTERES ESPECIAIS)
  -- --------------------------------------------------------------------------
  FOR i IN 1..25 LOOP
    v_phone := '+1415555' || LPAD(i::text, 4, '0');
    v_email := 'lead' || i || '@example.com';
    IF i <= 10 THEN
      v_product := 'slimsoda';
      v_page_type := 'pdp';
    ELSIF i <= 18 THEN
      v_product := 'sonnus';
      v_page_type := 'adv';
    ELSIF i <= 22 THEN
      v_product := 'crowned';
      v_page_type := 'listicle';
    ELSE
      v_product := 'linfaflow';
      v_page_type := 'power';
    END IF;

    INSERT INTO public.checkout_leads (
      name, email, phone, country_code, dial_code, source, product, page_type,
      offer, page_title, source_url, source_path, checkout_url, visitor_id,
      affid, hid, hcid, subid, utm_source, referrer, consent_given, created_at
    ) VALUES (
      'Lead Teste ' || i,
      v_email,
      v_phone,
      'US',
      '+1',
      'checkout_form',
      v_product,
      v_page_type,
      '1 Bottled Pack',
      'Página de Teste ' || i,
      'https://essencialgood.com/' || v_product,
      '/' || v_product,
      'https://cc.' || (CASE WHEN v_product = 'slimsoda' THEN 'slimsodapowder' ELSE v_product END) || '.com/checkout.php?affid=123',
      'vis_' || i,
      'aff_' || i,
      'hid_' || i,
      'hcid_' || i,
      'sub_' || i,
      'google',
      'https://google.com',
      true,
      v_now - (i || ' hours')::INTERVAL
    );
  END LOOP;

  -- FIXTURE ESPECIAL COM %, _ E \ NO NOME PARA TESTAR ESCAPE DE BUSCA
  INSERT INTO public.checkout_leads (
    name, email, phone, country_code, dial_code, source, product, page_type,
    source_path, checkout_url, consent_given, created_at
  ) VALUES (
    'Special 50% Off_Promo\Deal',
    'special_escaped@example.com',
    '+14155559999',
    'US',
    '+1',
    'checkout_form',
    'slimsoda',
    'pdp',
    '/slimsoda',
    'https://cc.slimsodapowder.com/checkout.php?affid=123',
    true,
    v_now
  );

  -- --------------------------------------------------------------------------
  -- 5. PAGINAÇÃO (PÁGINA 1, PÁGINA 2 E PÁGINA INEXISTENTE)
  -- --------------------------------------------------------------------------
  -- PÁGINA 1 (RETORNA 20 ITENS DE 26 TOTAIS)
  v_res := public.get_checkout_leads_admin(p_page => 1, p_page_size => 20);
  IF (v_res->'pagination'->>'total_items')::INT <> 26 OR
     (v_res->'pagination'->>'total_pages')::INT <> 2 OR
     jsonb_array_length(v_res->'items') <> 20 THEN
    RAISE EXCEPTION 'TEST FAILED: Paginação P1 incorreta: total_items=%, total_pages=%, len=%',
      v_res->'pagination'->>'total_items', v_res->'pagination'->>'total_pages', jsonb_array_length(v_res->'items');
  END IF;

  -- PÁGINA 2 (RETORNA 6 ITENS DE 26 TOTAIS)
  v_res := public.get_checkout_leads_admin(p_page => 2, p_page_size => 20);
  IF (v_res->'pagination'->>'total_items')::INT <> 26 OR
     (v_res->'pagination'->>'total_pages')::INT <> 2 OR
     jsonb_array_length(v_res->'items') <> 6 THEN
    RAISE EXCEPTION 'TEST FAILED: Paginação P2 incorreta: len=%', jsonb_array_length(v_res->'items');
  END IF;

  -- PÁGINA INEXISTENTE (PÁGINA 10 -> ITEMS VAZIO, MAS PAGINATION COM DADOS CORRETOS)
  v_res := public.get_checkout_leads_admin(p_page => 10, p_page_size => 20);
  IF (v_res->'pagination'->>'total_items')::INT <> 26 OR
     (v_res->'pagination'->>'total_pages')::INT <> 2 OR
     jsonb_array_length(v_res->'items') <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Página inexistente P10 incorreta: len=%', jsonb_array_length(v_res->'items');
  END IF;

  -- --------------------------------------------------------------------------
  -- 6. BUSCA E ESCAPE DE CARACTERES ESPECIAIS (NOME, EMAIL, TELEFONE, %, _, \)
  -- --------------------------------------------------------------------------
  -- BUSCA POR NOME
  v_res := public.get_checkout_leads_admin(p_search => 'Lead Teste 15');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca por nome incorreta: %', v_res->'pagination'->>'total_items';
  END IF;

  -- BUSCA POR E-MAIL
  v_res := public.get_checkout_leads_admin(p_search => 'lead15@example.com');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca por email incorreta: %', v_res->'pagination'->>'total_items';
  END IF;

  -- BUSCA POR TELEFONE
  v_res := public.get_checkout_leads_admin(p_search => '+14155550005');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca por telefone incorreta: %', v_res->'pagination'->>'total_items';
  END IF;

  -- BUSCA COM CARACTERE ESPECIAL '%' (NÃO DEVE ATUAR COMO WILDCARD GLOBAL)
  v_res := public.get_checkout_leads_admin(p_search => '50%');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca com %% incorreta: total_items=%', v_res->'pagination'->>'total_items';
  END IF;

  -- BUSCA COM CARACTERE ESPECIAL '_' (NÃO DEVE ATUAR COMO ANY-SINGLE-CHAR)
  v_res := public.get_checkout_leads_admin(p_search => 'Off_Promo');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca com _ incorreta: total_items=%', v_res->'pagination'->>'total_items';
  END IF;

  -- BUSCA COM CARACTERE ESPECIAL '\'
  v_res := public.get_checkout_leads_admin(p_search => 'Promo\Deal');
  IF (v_res->'pagination'->>'total_items')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Busca com \ incorreta: total_items=%', v_res->'pagination'->>'total_items';
  END IF;

  -- --------------------------------------------------------------------------
  -- 7. FILTROS DE PRODUTO E TIPO DE PÁGINA
  -- --------------------------------------------------------------------------
  -- PRODUTO 'slimsoda' (10 PADRÃO + 1 ESPECIAL = 11 TOTAIS)
  v_res := public.get_checkout_leads_admin(p_product => 'slimsoda');
  IF (v_res->'pagination'->>'total_items')::INT <> 11 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro por produto slimsoda incorreto: %', v_res->'pagination'->>'total_items';
  END IF;

  -- TIPO DE PÁGINA 'adv' (8 TOTAIS)
  v_res := public.get_checkout_leads_admin(p_page_type => 'adv');
  IF (v_res->'pagination'->>'total_items')::INT <> 8 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro por tipo de página adv incorreto: %', v_res->'pagination'->>'total_items';
  END IF;

  -- --------------------------------------------------------------------------
  -- 8. FILTRO DE INTERVALO TEMPORAL (INÍCIO INCLUSIVO, FIM EXCLUSIVO)
  -- --------------------------------------------------------------------------
  v_res := public.get_checkout_leads_admin(p_start_date => v_now - INTERVAL '48 hours', p_end_date => v_now + INTERVAL '1 minute');
  IF (v_res->'pagination'->>'total_items')::INT < 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro de datas com intervalo ativo retornou 0 itens.';
  END IF;

  -- --------------------------------------------------------------------------
  -- 9. CONFIRMAÇÃO DE CHECKOUT_URL E AUSÊNCIA DE OUTROS PARÂMETROS TÉCNICOS
  -- --------------------------------------------------------------------------
  v_res := public.get_checkout_leads_admin(p_page => 1, p_page_size => 1);
  v_first_item := v_res->'items'->0;

  IF NOT (v_first_item ? 'checkout_url') THEN
    RAISE EXCEPTION 'TEST FAILED: O retorno da RPC deve conter checkout_url para link de recuperação.';
  END IF;

  IF v_first_item ? 'affid' OR
     v_first_item ? 'hid' OR
     v_first_item ? 'hcid' OR
     v_first_item ? 'subid' OR
     v_first_item ? 'subid2' OR
     v_first_item ? 'subid3' OR
     v_first_item ? 'utm_source' OR
     v_first_item ? 'utm_medium' OR
     v_first_item ? 'utm_campaign' OR
     v_first_item ? 'utm_content' OR
     v_first_item ? 'utm_term' OR
     v_first_item ? 'referrer' OR
     v_first_item ? 'visitor_id' THEN
    RAISE EXCEPTION 'TEST FAILED: O retorno da RPC contém parâmetros de rastreamento separados proibidos: %', v_first_item;
  END IF;

  -- --------------------------------------------------------------------------
  -- 10. TESTE COM PERFIL AGENT
  -- --------------------------------------------------------------------------
  IF v_agent_id IS NOT NULL THEN
    PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'authenticated', 'sub', v_agent_id)::text, true);
    v_res := public.get_checkout_leads_admin();
    IF (v_res->'pagination'->>'total_items')::INT <> 26 THEN
      RAISE EXCEPTION 'TEST FAILED: Chamada com perfil agent falhou ou retornou contagem divergente: %', v_res;
    END IF;
  END IF;

  -- --------------------------------------------------------------------------
  -- 11. VERIFICAÇÃO DE PRIVILÉGIOS DE EXECUÇÃO
  -- --------------------------------------------------------------------------
  IF NOT has_function_privilege('authenticated', 'public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: authenticated deveria possuir privilégio de execução.';
  END IF;

  IF has_function_privilege('anon', 'public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: anon possui privilégio de execução não autorizado.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n
      ON n.oid = p.pronamespace
    CROSS JOIN LATERAL aclexplode(
      COALESCE(p.proacl, acldefault('f', p.proowner))
    ) acl
    WHERE n.nspname = 'public'
      AND p.proname = 'get_checkout_leads_admin'
      AND (
        p.oid = to_regprocedure('public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT)')
        OR pg_get_function_identity_arguments(p.oid) =
          'p_page integer, p_page_size integer, p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_product text, p_page_type text, p_search text'
      )
      AND acl.grantee = 0
      AND acl.privilege_type = 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'TEST FAILED: PUBLIC possui privilégio EXECUTE não autorizado.';
  END IF;

  RAISE NOTICE 'SUITE COMPLETA DA MIGRATION 007 EXECUTADA COM SUCESSO!';
END;
$$;

ROLLBACK;

SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;
