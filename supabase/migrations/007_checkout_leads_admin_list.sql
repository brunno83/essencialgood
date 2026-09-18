-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 007: CHECKOUT LEADS ADMIN LIST RPC
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

  -- 6. SELEÇÃO DOS ITENS PAGINADOS
  -- Mantém checkout_url apenas para ser consumido via botão "Copiar link de recuperação" / "Abrir checkout",
  -- sem expor affid, hid, hcid, subids, utms, referrer ou visitor_id.
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

-- 8. REVOGAR EXECUTE DE PUBLIC E CONCEDER APENAS PARA authenticated
REVOKE ALL ON FUNCTION public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_checkout_leads_admin(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) TO authenticated;
