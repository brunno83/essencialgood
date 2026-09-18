-- ============================================================================
-- TESTE TRANSACIONAL DE VALIDAÇÃO COMPLETA (AUTOCONTIDO) — MIGRATION 006
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. DEFINIÇÃO COMPLETA E LITERAL DA MIGRATION 006
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_lead_source_analytics(
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL,
  p_product TEXT DEFAULT 'all',
  p_page_type TEXT DEFAULT 'all'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_prod_filter TEXT;
  v_page_filter TEXT;
  v_node_count INT := 0;
  v_max_iters INT := 0;
  v_iter INT := 0;
  v_rows_updated INT := 1;

  v_total_unique BIGINT := 0;
  v_total_chat BIGINT := 0;
  v_total_checkout BIGINT := 0;
  v_chat_only BIGINT := 0;
  v_checkout_only BIGINT := 0;
  v_both BIGINT := 0;

  v_pct_chat_only NUMERIC := 0.00;
  v_pct_checkout_only NUMERIC := 0.00;
  v_pct_both NUMERIC := 0.00;
  v_pct_chat_reach NUMERIC := 0.00;
  v_pct_checkout_reach NUMERIC := 0.00;

  v_result JSONB;
BEGIN
  -- 1. SEGURANÇA CRÍTICA: Bloqueia qualquer chamada que não seja autenticada ou sem perfil admin/agent
  IF auth.role() <> 'authenticated' OR NOT public.is_admin_or_agent() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  -- 2. VALIDAÇÃO DE PARÂMETROS
  v_prod_filter := lower(trim(COALESCE(p_product, 'all')));
  v_page_filter := lower(trim(COALESCE(p_page_type, 'all')));

  IF v_prod_filter NOT IN ('all', 'slimsoda', 'sonnus', 'crowned', 'linfaflow', 'memoflow') THEN
    RAISE EXCEPTION 'Produto inválido: %', p_product;
  END IF;

  IF v_page_filter NOT IN ('all', 'pdp', 'listicle', 'adv', 'power') THEN
    RAISE EXCEPTION 'Tipo de página inválido: %', p_page_type;
  END IF;

  IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL AND p_start_date >= p_end_date THEN
    RAISE EXCEPTION 'Data inicial deve ser anterior à data final.';
  END IF;

  -- 3. LIMPEZA SEGURA DE TABELAS TEMPORÁRIAS ANTERIORES NO PG_TEMP
  DROP TABLE IF EXISTS pg_temp.tmp_lead_edges;
  DROP TABLE IF EXISTS pg_temp.tmp_lead_nodes;
  DROP TABLE IF EXISTS pg_temp.tmp_lead_groups;

  -- 4. CRIAÇÃO E CARGA DOS NÓS DO GRAFO
  CREATE TEMP TABLE tmp_lead_nodes (
    node_id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    source TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    visitor_id TEXT
  ) ON COMMIT DROP;

  -- 4.1 Carregar conversas (chat)
  INSERT INTO pg_temp.tmp_lead_nodes (node_id, group_id, source, phone, email, visitor_id)
  SELECT
    'chat:' || c.id::text,
    'chat:' || c.id::text,
    'chat',
    NULLIF(trim(c.visitor_phone::text), ''),
    NULLIF(lower(trim(c.visitor_email::text)), ''),
    NULLIF(trim(c.visitor_id::text), '')
  FROM public.conversations c
  WHERE (p_start_date IS NULL OR c.created_at >= p_start_date)
    AND (p_end_date IS NULL OR c.created_at < p_end_date)
    AND (
      v_prod_filter = 'all'
      OR (
        CASE
          WHEN c.source_product IS NULL OR trim(c.source_product::text) = '' THEN 'unknown'
          ELSE lower(trim(c.source_product::text))
        END = v_prod_filter
      )
    )
    AND (
      v_page_filter = 'all'
      OR (
        CASE
          WHEN c.source_path IS NULL OR trim(c.source_path::text) = '' THEN 'unknown'
          WHEN lower(trim(c.source_path::text)) LIKE '%/adv-%' OR lower(trim(c.source_path::text)) LIKE '%/adv/%' THEN 'adv'
          WHEN lower(trim(c.source_path::text)) LIKE '%power%' THEN 'power'
          WHEN lower(trim(c.source_path::text)) LIKE '%/listicle/%' THEN 'listicle'
          WHEN lower(trim(c.source_path::text)) = '/' OR lower(rtrim(trim(c.source_path::text), '/')) IN ('/slimsoda', '/sonnus', '/crowned', '/linfaflow', '/memoflow') THEN 'pdp'
          ELSE 'unknown'
        END = v_page_filter
      )
    );

  -- 4.2 Carregar leads de pré-checkout
  INSERT INTO pg_temp.tmp_lead_nodes (node_id, group_id, source, phone, email, visitor_id)
  SELECT
    'checkout:' || l.id::text,
    'checkout:' || l.id::text,
    'checkout',
    NULLIF(trim(l.phone::text), ''),
    NULLIF(lower(trim(l.email::text)), ''),
    NULLIF(trim(l.visitor_id::text), '')
  FROM public.checkout_leads l
  WHERE (p_start_date IS NULL OR l.created_at >= p_start_date)
    AND (p_end_date IS NULL OR l.created_at < p_end_date)
    AND (
      v_prod_filter = 'all'
      OR (
        CASE
          WHEN l.product IS NULL OR trim(l.product::text) = '' THEN 'unknown'
          ELSE lower(trim(l.product::text))
        END = v_prod_filter
      )
    )
    AND (
      v_page_filter = 'all'
      OR (
        CASE
          WHEN l.page_type IS NULL OR trim(l.page_type::text) = '' THEN 'unknown'
          ELSE lower(trim(l.page_type::text))
        END = v_page_filter
      )
    );

  -- Contagem total de nós para cálculo dinâmico do limite de iterações
  SELECT COUNT(*) INTO v_node_count FROM pg_temp.tmp_lead_nodes;
  IF v_node_count = 0 THEN
    RETURN jsonb_build_object(
      'total_unique_leads', 0,
      'total_chat_leads', 0,
      'total_checkout_leads', 0,
      'chat_only_leads', 0,
      'checkout_only_leads', 0,
      'both_sources_leads', 0,
      'pct_chat_only', 0.00,
      'pct_checkout_only', 0.00,
      'pct_both_sources', 0.00,
      'pct_chat_reach', 0.00,
      'pct_checkout_reach', 0.00
    );
  END IF;

  v_max_iters := GREATEST(v_node_count + 10, 50);

  -- Índices temporários na tabela de nós
  CREATE INDEX idx_tmp_nodes_phone ON pg_temp.tmp_lead_nodes (phone) WHERE phone IS NOT NULL;
  CREATE INDEX idx_tmp_nodes_email ON pg_temp.tmp_lead_nodes (email) WHERE email IS NOT NULL;
  CREATE INDEX idx_tmp_nodes_visitor ON pg_temp.tmp_lead_nodes (visitor_id) WHERE visitor_id IS NOT NULL;

  -- 5. CRIAÇÃO DA TABELA TEMPORÁRIA DE ARESTAS (SEM CROSS JOIN GLOBAL)
  CREATE TEMP TABLE tmp_lead_edges (
    node_a TEXT NOT NULL,
    node_b TEXT NOT NULL,
    PRIMARY KEY (node_a, node_b)
  ) ON COMMIT DROP;

  INSERT INTO pg_temp.tmp_lead_edges (node_a, node_b)
  SELECT n1.node_id, n2.node_id
  FROM pg_temp.tmp_lead_nodes n1
  JOIN pg_temp.tmp_lead_nodes n2 ON n1.phone = n2.phone AND n1.node_id <> n2.node_id
  WHERE n1.phone IS NOT NULL
  UNION
  SELECT n1.node_id, n2.node_id
  FROM pg_temp.tmp_lead_nodes n1
  JOIN pg_temp.tmp_lead_nodes n2 ON n1.email = n2.email AND n1.node_id <> n2.node_id
  WHERE n1.email IS NOT NULL
  UNION
  SELECT n1.node_id, n2.node_id
  FROM pg_temp.tmp_lead_nodes n1
  JOIN pg_temp.tmp_lead_nodes n2 ON n1.visitor_id = n2.visitor_id AND n1.node_id <> n2.node_id
  WHERE n1.visitor_id IS NOT NULL;

  -- Índices temporários na tabela de arestas
  CREATE INDEX idx_tmp_edges_node_a ON pg_temp.tmp_lead_edges (node_a);
  CREATE INDEX idx_tmp_edges_node_b ON pg_temp.tmp_lead_edges (node_b);

  -- 6. PROPAGAÇÃO DE GROUP_ID UTILIZANDO A TABELA DE ARESTAS E ÍNDICES
  v_rows_updated := 1;
  v_iter := 0;

  WHILE v_rows_updated > 0 LOOP
    v_iter := v_iter + 1;
    IF v_iter > v_max_iters THEN
      RAISE EXCEPTION 'Connected components algorithm did not converge within % iterations.', v_max_iters;
    END IF;

    WITH min_neighbor AS (
      SELECT
        e.node_a AS node_id,
        MIN(nbr.group_id) AS min_group_id
      FROM pg_temp.tmp_lead_edges e
      JOIN pg_temp.tmp_lead_nodes nbr ON e.node_b = nbr.node_id
      GROUP BY e.node_a
    )
    UPDATE pg_temp.tmp_lead_nodes n
    SET group_id = LEAST(n.group_id, mn.min_group_id)
    FROM min_neighbor mn
    WHERE n.node_id = mn.node_id
      AND mn.min_group_id < n.group_id;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  END LOOP;

  -- 7. AGREGAÇÃO DOS GRUPOS CONEXOS
  CREATE TEMP TABLE tmp_lead_groups (
    group_id TEXT PRIMARY KEY,
    has_chat BOOLEAN NOT NULL,
    has_checkout BOOLEAN NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO pg_temp.tmp_lead_groups (group_id, has_chat, has_checkout)
  SELECT
    group_id,
    BOOL_OR(source = 'chat') AS has_chat,
    BOOL_OR(source = 'checkout') AS has_checkout
  FROM pg_temp.tmp_lead_nodes
  GROUP BY group_id;

  -- 8. CÁLCULO FINAL DE MÉTRICAS E PERCENTUAIS
  SELECT
    COUNT(*) AS total_unique,
    COUNT(*) FILTER (WHERE has_chat) AS total_chat,
    COUNT(*) FILTER (WHERE has_checkout) AS total_checkout,
    COUNT(*) FILTER (WHERE has_chat AND NOT has_checkout) AS chat_only,
    COUNT(*) FILTER (WHERE has_checkout AND NOT has_chat) AS checkout_only,
    COUNT(*) FILTER (WHERE has_chat AND has_checkout) AS both_sources
  INTO
    v_total_unique,
    v_total_chat,
    v_total_checkout,
    v_chat_only,
    v_checkout_only,
    v_both
  FROM pg_temp.tmp_lead_groups;

  IF v_total_unique > 0 THEN
    v_pct_chat_only := ROUND((v_chat_only::NUMERIC / v_total_unique::NUMERIC) * 100.0, 2);
    v_pct_checkout_only := ROUND((v_checkout_only::NUMERIC / v_total_unique::NUMERIC) * 100.0, 2);
    v_pct_both := ROUND((v_both::NUMERIC / v_total_unique::NUMERIC) * 100.0, 2);
    v_pct_chat_reach := ROUND((v_total_chat::NUMERIC / v_total_unique::NUMERIC) * 100.0, 2);
    v_pct_checkout_reach := ROUND((v_total_checkout::NUMERIC / v_total_unique::NUMERIC) * 100.0, 2);
  END IF;

  v_result := jsonb_build_object(
    'total_unique_leads', v_total_unique,
    'total_chat_leads', v_total_chat,
    'total_checkout_leads', v_total_checkout,
    'chat_only_leads', v_chat_only,
    'checkout_only_leads', v_checkout_only,
    'both_sources_leads', v_both,
    'pct_chat_only', v_pct_chat_only,
    'pct_checkout_only', v_pct_checkout_only,
    'pct_both_sources', v_pct_both,
    'pct_chat_reach', v_pct_chat_reach,
    'pct_checkout_reach', v_pct_checkout_reach
  );

  RETURN v_result;
END;
$$;

-- Permissões estritas da RPC
REVOKE ALL ON FUNCTION public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. VERIFICAÇÃO INICIAL E TABELA TEMPORÁRIA DE CONTEXTO DO TESTE
-- ----------------------------------------------------------------------------

CREATE TEMP TABLE tmp_migration_006_test_context (
  admin_id UUID NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_migration_006_test_context (admin_id)
SELECT id
FROM public.admin_profiles
WHERE role = 'admin'
LIMIT 1;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tmp_migration_006_test_context) THEN
    RAISE EXCEPTION 'TEST FAILED: Nenhum administrador encontrado em public.admin_profiles para o contexto de teste.';
  END IF;

  -- Confirmar que a janela de teste 2099 está limpa
  IF EXISTS (
    SELECT 1 FROM public.conversations WHERE created_at >= '2099-01-01 00:00:00+00' AND created_at < '2099-02-01 00:00:00+00'
  ) OR EXISTS (
    SELECT 1 FROM public.checkout_leads WHERE created_at >= '2099-01-01 00:00:00+00' AND created_at < '2099-02-01 00:00:00+00'
  ) THEN
    RAISE EXCEPTION 'TEST FAILED: A janela de teste 2099 contém registros pré-existentes.';
  END IF;

  -- Confirmar que public.checkout_leads possui RLS (rowsecurity) habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'checkout_leads' AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'TEST FAILED: RLS (rowsecurity) deve estar habilitado na tabela public.checkout_leads.';
  END IF;
END;
$$;

-- ============================================================================
-- 3. TESTES DE RLS DIRETO EM CHECKOUT_LEADS COM SET LOCAL ROLE
-- ============================================================================

-- ETAPA A: Inserir fixture de teste de RLS como superuser/postgres
DO $$
DECLARE
  v_t1 TIMESTAMPTZ := '2099-01-15 10:00:00+00';
  v_checkout_url CONSTANT TEXT := 'https://cc.slimsodapowder.com/dtcnew/checkout.php?affid=TEST_MIGRATION_006';
BEGIN
  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000099', 'RLS Test Lead', 'rls_test@test.com', '+14155551099', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );
END;
$$;

-- ETAPA B: Teste do Agent (Role PostgreSQL = authenticated + JWT Claim role = agent)
UPDATE public.admin_profiles
SET role = 'agent'
WHERE id = (SELECT admin_id FROM tmp_migration_006_test_context);

SELECT set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', (SELECT admin_id FROM tmp_migration_006_test_context)::text,
    'role', 'authenticated'
  )::text,
  true
);

SET LOCAL ROLE authenticated;

DO $$
BEGIN
  IF current_user <> 'authenticated' THEN
    RAISE EXCEPTION 'TEST FAILED: current_user deve ser authenticated (obtido %).', current_user;
  END IF;

  IF (SELECT COUNT(*) FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000099') <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Agent (role agent) NÃO deve enxergar linhas diretamente em checkout_leads via RLS.';
  END IF;
END;
$$;

RESET ROLE;

UPDATE public.admin_profiles
SET role = 'admin'
WHERE id = (SELECT admin_id FROM tmp_migration_006_test_context);

-- ETAPA C: Teste do Admin (Role PostgreSQL = authenticated + JWT Claim role = admin)
SELECT set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', (SELECT admin_id FROM tmp_migration_006_test_context)::text,
    'role', 'authenticated'
  )::text,
  true
);

SET LOCAL ROLE authenticated;

DO $$
BEGIN
  IF current_user <> 'authenticated' THEN
    RAISE EXCEPTION 'TEST FAILED: current_user deve ser authenticated (obtido %).', current_user;
  END IF;

  IF (SELECT COUNT(*) FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000099') <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Administrador DEVE enxergar a linha diretamente em checkout_leads via RLS.';
  END IF;
END;
$$;

RESET ROLE;

-- ETAPA D: Teste do Anon (Role PostgreSQL = anon)
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);

SET LOCAL ROLE anon;

DO $$
DECLARE
  v_count INT := 0;
  v_err_caught BOOLEAN := FALSE;
BEGIN
  IF current_user <> 'anon' THEN
    RAISE EXCEPTION 'TEST FAILED: current_user deve ser anon (obtido %).', current_user;
  END IF;

  BEGIN
    SELECT COUNT(*) INTO v_count FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000099';
  EXCEPTION WHEN OTHERS THEN
    -- Exceção permission denied é esperada e aceita para a role anon
    v_err_caught := TRUE;
  END;

  IF NOT v_err_caught AND v_count <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Papel anon não deve enxergar nenhuma linha diretamente em checkout_leads.';
  END IF;
END;
$$;

RESET ROLE;

-- Limpar fixture do RLS como superuser/postgres
DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000099';

-- ============================================================================
-- 4. TESTES DA RPC ANALÍTICA (PERMISSÕES E CASOS DE NEGÓCIO)
-- ============================================================================

DO $$
DECLARE
  v_res JSONB;
  v_err_caught BOOLEAN := FALSE;
  v_real_admin_id UUID;
  v_random_user_id UUID := gen_random_uuid();
  v_start TIMESTAMPTZ := '2099-01-01 00:00:00+00';
  v_end   TIMESTAMPTZ := '2099-02-01 00:00:00+00';
  v_t1 TIMESTAMPTZ := '2099-01-15 10:00:00+00';
  v_checkout_url CONSTANT TEXT := 'https://cc.slimsodapowder.com/dtcnew/checkout.php?affid=TEST_MIGRATION_006';
  i INT;
BEGIN
  -- Selecionar Administrador Real a partir da tabela temporária de contexto
  SELECT admin_id INTO v_real_admin_id FROM tmp_migration_006_test_context;

  -- --------------------------------------------------------------------------
  -- TESTES DE SEGURANÇA E PERMISSÕES DA RPC
  -- --------------------------------------------------------------------------

  -- 1. Permissão da RPC para anon (deve ser FALSE)
  IF has_function_privilege('anon', 'public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: Papel anon não deve ter permissão EXECUTE na RPC.';
  END IF;

  -- 2. Permissão da RPC para authenticated (deve ser TRUE)
  IF NOT has_function_privilege('authenticated', 'public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT)', 'EXECUTE') THEN
    RAISE EXCEPTION 'TEST FAILED: Papel authenticated deve ter permissão EXECUTE na RPC.';
  END IF;

  -- 3. Execução da RPC por papel 'anon' (deve ser bloqueada com Access denied)
  PERFORM set_config('request.jwt.claims', '{"role":"anon"}', true);
  v_err_caught := FALSE;
  BEGIN
    PERFORM public.get_lead_source_analytics(v_start, v_end);
  EXCEPTION WHEN OTHERS THEN
    v_err_caught := TRUE;
  END;
  IF NOT v_err_caught THEN
    RAISE EXCEPTION 'TEST FAILED: Chamada da RPC com anon deveria ter sido bloqueada.';
  END IF;

  -- 4. Execução da RPC por usuário autenticado SEM perfil admin/agent (deve ser bloqueada)
  PERFORM set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', v_random_user_id::text)::text, true);
  v_err_caught := FALSE;
  BEGIN
    PERFORM public.get_lead_source_analytics(v_start, v_end);
  EXCEPTION WHEN OTHERS THEN
    v_err_caught := TRUE;
  END;
  IF NOT v_err_caught THEN
    RAISE EXCEPTION 'TEST FAILED: Usuário autenticado sem perfil deveria ter sido bloqueado.';
  END IF;

  -- 5. Execução da RPC por Administrador Real (deve ter sucesso)
  PERFORM set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', v_real_admin_id::text)::text, true);
  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: Administrador não conseguiu executar a RPC.';
  END IF;

  -- 6. Execução da RPC por Agent (alteração temporária do perfil para agent)
  UPDATE public.admin_profiles SET role = 'agent' WHERE id = v_real_admin_id;
  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT IS NULL THEN
    RAISE EXCEPTION 'TEST FAILED: Agent não conseguiu executar a RPC.';
  END IF;

  -- Restaurar perfil para admin
  UPDATE public.admin_profiles SET role = 'admin' WHERE id = v_real_admin_id;

  -- Manter contexto JWT como admin para o restante dos testes
  PERFORM set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', v_real_admin_id::text)::text, true);

  -- 7. Confirmar ausência de PII no retorno da RPC
  IF v_res ? 'email' OR v_res ? 'phone' OR v_res ? 'visitor_id' OR v_res ? 'name' OR v_res ? 'visitor_name' THEN
    RAISE EXCEPTION 'TEST FAILED: O JSON retornado pela RPC contém campos de PII.';
  END IF;

  -- --------------------------------------------------------------------------
  -- TESTE DE NENHUM REGISTRO NA JANELA (TOTAL ZERO)
  -- --------------------------------------------------------------------------
  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 0 OR (v_res->>'pct_chat_only')::NUMERIC <> 0.00 THEN
    RAISE EXCEPTION 'TEST FAILED: Janela limpa deveria retornar contagem 0 e percentual 0.00.';
  END IF;

  -- --------------------------------------------------------------------------
  -- TESTE 1: Somente Chat
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (
    id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, visitor_email, source_product, source_path, created_at
  ) VALUES (
    '10000000-0000-0000-0000-000000000001', v_real_admin_id, 'Lead Chat', '+14155551001', 'US', '+1', 'chat1@test.com', 'slimsoda', '/slimsoda', v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'chat_only_leads')::INT <> 1 OR (v_res->>'checkout_only_leads')::INT <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Cenário Somente Chat falhou. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000001';

  -- --------------------------------------------------------------------------
  -- TESTE 2: Somente Formulário (Respeitando todas as constraints reais de checkout_leads)
  -- --------------------------------------------------------------------------
  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000001', 'Lead Checkout', 'checkout1@test.com', '+14155551002', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'checkout_only_leads')::INT <> 1 OR (v_res->>'chat_only_leads')::INT <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Cenário Somente Formulário falhou. Retornou %', v_res;
  END IF;

  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000001';

  -- --------------------------------------------------------------------------
  -- TESTE 3: Telefone Igual (Mesmo Lead no Chat e Pré-checkout)
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (
    id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, visitor_email, source_product, source_path, created_at
  ) VALUES (
    '10000000-0000-0000-0000-000000000002', v_real_admin_id, 'Lead Dual', '+14155551003', 'US', '+1', 'chat2@test.com', 'slimsoda', '/slimsoda', v_t1
  );

  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000002', 'Lead Dual', 'diff@test.com', '+14155551003', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'both_sources_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Deduplicação por Telefone Igual falhou. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000002';
  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000002';

  -- --------------------------------------------------------------------------
  -- TESTE 4: E-mail Igual com Telefones Diferentes (União Transitiva)
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (
    id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, visitor_email, source_product, source_path, created_at
  ) VALUES (
    '10000000-0000-0000-0000-000000000003', v_real_admin_id, 'Same Email Lead', '+14155551004', 'US', '+1', 'same_email@test.com', 'slimsoda', '/slimsoda', v_t1
  );

  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000003', 'Same Email Lead', 'same_email@test.com', '+14155551005', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'both_sources_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Deduplicação por E-mail Igual falhou. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000003';
  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000003';

  -- --------------------------------------------------------------------------
  -- TESTE 5: Visitor ID Igual (Utilizando FK Válida auth.users via v_real_admin_id)
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (
    id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, visitor_email, source_product, source_path, created_at
  ) VALUES (
    '10000000-0000-0000-0000-000000000004', v_real_admin_id, 'Visitor Lead', '+14155551006', 'US', '+1', 'vis1@test.com', 'slimsoda', '/slimsoda', v_t1
  );

  INSERT INTO public.checkout_leads (
    id, visitor_id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000004', v_real_admin_id::text, 'Visitor Lead', 'vis2@test.com', '+14155551007', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'both_sources_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Deduplicação por Visitor ID falhou. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000004';
  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000004';

  -- --------------------------------------------------------------------------
  -- TESTE 6: Mesmo Nome com Identificadores Diferentes (NÃO deve unir!)
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (
    id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, visitor_email, source_product, source_path, created_at
  ) VALUES (
    '10000000-0000-0000-0000-000000000006', v_real_admin_id, 'Maria Silva', '+14155551008', 'US', '+1', 'maria1@test.com', 'slimsoda', '/slimsoda', v_t1
  );

  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000006', 'Maria Silva', 'maria2@test.com', '+14155551009', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 2 OR (v_res->>'chat_only_leads')::INT <> 1 OR (v_res->>'checkout_only_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Mesmo nome com identificadores diferentes não deve unir. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000006';
  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000006';

  -- --------------------------------------------------------------------------
  -- TESTE 7: Registros sem identificadores (Conversation sem tel/email/visitor_id + Checkout lead válido)
  -- --------------------------------------------------------------------------
  INSERT INTO public.conversations (id, visitor_id, visitor_name, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000030', v_real_admin_id, 'Anon Chat', 'slimsoda', '/slimsoda', v_t1);

  INSERT INTO public.checkout_leads (
    id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
  ) VALUES (
    '20000000-0000-0000-0000-000000000030', 'Valid Checkout', 'valid@test.com', '+14155551010', 'US', '+1',
    'slimsoda', 'pdp', v_checkout_url, true, v_t1, v_t1
  );

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 2 OR (v_res->>'chat_only_leads')::INT <> 1 OR (v_res->>'checkout_only_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Conversation sem identificadores deve contar como lead isolado. Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000030';
  DELETE FROM public.checkout_leads WHERE id = '20000000-0000-0000-0000-000000000030';

  -- --------------------------------------------------------------------------
  -- TESTE 8: Cadeia Transitiva Contínua de 25 Registros no Pré-checkout
  -- (Alternando E-mail e Telefone para formar 1 único componente conexo)
  -- --------------------------------------------------------------------------
  FOR i IN 1..25 LOOP
    INSERT INTO public.checkout_leads (
      id, name, email, phone, country_code, dial_code, product, page_type, checkout_url, consent_given, consent_at, created_at
    ) VALUES (
      ('40000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
      'Chain Lead ' || i,
      CASE 
        WHEN i % 2 = 1 THEN 'chain_email_' || ((i + 1) / 2)::text || '@test.com'
        ELSE 'chain_email_' || (i / 2)::text || '@test.com'
      END,
      CASE 
        WHEN i % 2 = 0 THEN '+1415555' || lpad((i / 2)::text, 4, '0')
        WHEN i > 1 THEN '+1415555' || lpad(((i - 1) / 2)::text, 4, '0')
        ELSE '+14155559999'
      END,
      'US',
      '+1',
      'slimsoda',
      'pdp',
      v_checkout_url,
      true,
      v_t1,
      v_t1
    );
  END LOOP;

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 OR (v_res->>'total_checkout_leads')::INT <> 1 OR (v_res->>'checkout_only_leads')::INT <> 1 OR (v_res->>'total_chat_leads')::INT <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Cadeia transitiva contínua de 25 registros no pré-checkout deveria resultar em 1 único lead. Retornou %', v_res;
  END IF;

  FOR i IN 1..25 LOOP
    DELETE FROM public.checkout_leads WHERE id = ('40000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid;
  END LOOP;

  -- --------------------------------------------------------------------------
  -- TESTE 9: Mapeamento de Caminhos (PDP com/sem barra, ADV, Power, Listicle, Unknown)
  -- (Executado de forma sequencial para respeitar o índice único idx_unique_active_visitor_conversation)
  -- --------------------------------------------------------------------------
  -- 9.1 PDP
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000060', v_real_admin_id, 'PDP Slash', '+14155551011', 'US', '+1', 'slimsoda', '/slimsoda/', v_t1);

  v_res := public.get_lead_source_analytics(v_start, v_end, 'all', 'pdp');
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro PDP falhou. Esperado 1, obteve %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000060';

  -- 9.2 ADV
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000061', v_real_admin_id, 'ADV Nested', '+14155551012', 'US', '+1', 'slimsoda', '/adv-slimsoda/', v_t1);

  v_res := public.get_lead_source_analytics(v_start, v_end, 'all', 'adv');
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro ADV falhou. Esperado 1, obteve %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000061';

  -- 9.3 Power
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000062', v_real_admin_id, 'Power Lead', '+14155551013', 'US', '+1', 'slimsoda', '/slimsodapower', v_t1);

  v_res := public.get_lead_source_analytics(v_start, v_end, 'all', 'power');
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro Power falhou. Esperado 1, obteve %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000062';

  -- 9.4 Listicle
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000063', v_real_admin_id, 'Listicle Lead', '+14155551014', 'US', '+1', 'slimsoda', '/listicle/slimsoda', v_t1);

  v_res := public.get_lead_source_analytics(v_start, v_end, 'all', 'listicle');
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro Listicle falhou. Esperado 1, obteve %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000063';

  -- 9.5 Unknown Path e Filtro 'all'
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000064', v_real_admin_id, 'Unknown Path', '+14155551015', 'US', '+1', 'slimsoda', '/random-path', v_t1);

  v_res := public.get_lead_source_analytics(v_start, v_end, 'all', 'all');
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Filtro All falhou. Esperado 1 lead único, obteve %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000064';

  -- --------------------------------------------------------------------------
  -- TESTE 10: Intervalo [início inclusivo, fim exclusivo)
  -- (Executado de forma sequencial para respeitar o índice único idx_unique_active_visitor_conversation)
  -- --------------------------------------------------------------------------
  -- 10.1 Início Exato (Inclusivo: deve retornar 1)
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000070', v_real_admin_id, 'Exact Start', '+14155551016', 'US', '+1', 'slimsoda', '/slimsoda', v_start);

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 1 THEN
    RAISE EXCEPTION 'TEST FAILED: Registro no início exato deveria ser incluído [start, end). Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000070';

  -- 10.2 Fim Exato (Exclusivo: deve retornar 0)
  INSERT INTO public.conversations (id, visitor_id, visitor_name, visitor_phone, visitor_country_code, visitor_dial_code, source_product, source_path, created_at)
  VALUES ('10000000-0000-0000-0000-000000000071', v_real_admin_id, 'Exact End', '+14155551017', 'US', '+1', 'slimsoda', '/slimsoda', v_end);

  v_res := public.get_lead_source_analytics(v_start, v_end);
  IF (v_res->>'total_unique_leads')::INT <> 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Registro no fim exato DEVE ser excluído [start, end). Retornou %', v_res;
  END IF;

  DELETE FROM public.conversations WHERE id = '10000000-0000-0000-0000-000000000071';

  -- --------------------------------------------------------------------------
  -- TESTE 11: Resiliência de pg_temp (Múltiplas Chamadas Consecutivas)
  -- --------------------------------------------------------------------------
  PERFORM public.get_lead_source_analytics(v_start, v_end);
  PERFORM public.get_lead_source_analytics(v_start, v_end, 'slimsoda');
  PERFORM public.get_lead_source_analytics(v_start, v_end, 'all', 'adv');

  RAISE NOTICE 'TODAS AS ASSERÇÕES PASSARAM COM SUCESSO NO TESTE TRANSACIONAL.';
END;
$$;

ROLLBACK;

-- Confirmação final exibida apenas após rollback garantido
SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;
