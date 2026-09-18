-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 006: LEAD SOURCE ANALYTICS RPC
-- ============================================================================

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

-- 9. PERMISSÕES E SEGURANÇA ESTRITAS
REVOKE ALL ON FUNCTION public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_lead_source_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;
