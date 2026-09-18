-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 005: PRE-CHECKOUT LEADS & SECURE RPC
-- ============================================================================

-- 1. CRIAR TABELA public.checkout_leads
CREATE TABLE IF NOT EXISTS public.checkout_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visitor_id TEXT CHECK (visitor_id IS NULL OR (char_length(visitor_id) <= 128 AND visitor_id !~ '[<>]')),
  name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2 AND char_length(name) <= 120 AND name !~ '[<>]'),
  email TEXT NOT NULL CHECK (char_length(trim(email)) >= 5 AND char_length(email) <= 150 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (char_length(phone) <= 16 AND phone ~ '^[+][1-9][0-9]{7,14}$'),
  country_code VARCHAR(2) NOT NULL CHECK (country_code IN ('US', 'CA', 'GB', 'AU', 'NZ')),
  dial_code VARCHAR(6) NOT NULL CHECK (dial_code IN ('+1', '+44', '+61', '+64')),
  source VARCHAR(50) NOT NULL DEFAULT 'checkout_form' CHECK (source = 'checkout_form'),
  product VARCHAR(50) NOT NULL CHECK (product IN ('slimsoda', 'sonnus', 'crowned', 'linfaflow', 'memoflow')),
  page_type VARCHAR(50) NOT NULL CHECK (page_type IN ('pdp', 'listicle', 'adv', 'power')),
  offer TEXT CHECK (offer IS NULL OR (char_length(offer) <= 100 AND offer !~ '[<>]')),
  page_title TEXT CHECK (page_title IS NULL OR (char_length(page_title) <= 300 AND page_title !~ '[<>]')),
  source_url TEXT CHECK (source_url IS NULL OR (source_url ~* '^https?://' AND char_length(source_url) <= 2048)),
  source_path TEXT CHECK (source_path IS NULL OR char_length(source_path) <= 1024),
  checkout_url TEXT NOT NULL CHECK (checkout_url ~* '^https://' AND char_length(checkout_url) <= 4096),
  affid TEXT CHECK (affid IS NULL OR (char_length(affid) <= 255 AND affid !~ '[<>]')),
  hid TEXT CHECK (hid IS NULL OR (char_length(hid) <= 2048 AND hid !~ '[<>]')),
  hcid TEXT CHECK (hcid IS NULL OR (char_length(hcid) <= 255 AND hcid !~ '[<>]')),
  subid TEXT CHECK (subid IS NULL OR (char_length(subid) <= 255 AND subid !~ '[<>]')),
  subid2 TEXT CHECK (subid2 IS NULL OR (char_length(subid2) <= 255 AND subid2 !~ '[<>]')),
  subid3 TEXT CHECK (subid3 IS NULL OR (char_length(subid3) <= 255 AND subid3 !~ '[<>]')),
  utm_source TEXT CHECK (utm_source IS NULL OR (char_length(utm_source) <= 500 AND utm_source !~ '[<>]')),
  utm_medium TEXT CHECK (utm_medium IS NULL OR (char_length(utm_medium) <= 500 AND utm_medium !~ '[<>]')),
  utm_campaign TEXT CHECK (utm_campaign IS NULL OR (char_length(utm_campaign) <= 500 AND utm_campaign !~ '[<>]')),
  utm_content TEXT CHECK (utm_content IS NULL OR (char_length(utm_content) <= 500 AND utm_content !~ '[<>]')),
  utm_term TEXT CHECK (utm_term IS NULL OR (char_length(utm_term) <= 500 AND utm_term !~ '[<>]')),
  referrer TEXT CHECK (referrer IS NULL OR (char_length(referrer) <= 2048 AND referrer !~ '[<>]')),
  consent_given BOOLEAN NOT NULL CHECK (consent_given = true),
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint de coerência do telefone com o DDI e da dupla País / DDI
  CONSTRAINT check_checkout_lead_phone_triad CHECK (
    phone IS NOT NULL AND country_code IS NOT NULL AND dial_code IS NOT NULL
    AND (
      (country_code IN ('US', 'CA') AND dial_code = '+1') OR
      (country_code = 'GB' AND dial_code = '+44') OR
      (country_code = 'AU' AND dial_code = '+61') OR
      (country_code = 'NZ' AND dial_code = '+64')
    )
    AND phone LIKE (dial_code || '%')
  ),

  -- Constraint de MemoFlow restrito a adv e power
  CONSTRAINT check_checkout_lead_memoflow_pages CHECK (
    product <> 'memoflow' OR page_type IN ('adv', 'power')
  )
);

-- 2. ÍNDICES DE PERFORMANCE E CONSULTA ADMINISTRATIVA
CREATE INDEX IF NOT EXISTS idx_checkout_leads_created_at ON public.checkout_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_leads_phone ON public.checkout_leads (phone);
CREATE INDEX IF NOT EXISTS idx_checkout_leads_email_lower ON public.checkout_leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_checkout_leads_visitor_id ON public.checkout_leads (visitor_id);
CREATE INDEX IF NOT EXISTS idx_checkout_leads_product ON public.checkout_leads (product);
CREATE INDEX IF NOT EXISTS idx_checkout_leads_source ON public.checkout_leads (source);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;

-- 4. REVOGAR PERMISSÕES PÚBLICAS E CONCEDER APENAS PARA AUTHENTICATED
REVOKE ALL ON TABLE public.checkout_leads FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkout_leads TO authenticated;

-- 5. POLICY EXCLUSIVA PARA ADMINISTRADORES (SELECT, UPDATE, DELETE, INSERT)
DROP POLICY IF EXISTS checkout_leads_admin_all ON public.checkout_leads;
CREATE POLICY checkout_leads_admin_all ON public.checkout_leads
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. RPC PÚBLICA SEGURA: save_checkout_lead
CREATE OR REPLACE FUNCTION public.save_checkout_lead(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_country_code TEXT,
  p_dial_code TEXT,
  p_product TEXT,
  p_page_type TEXT,
  p_consent_given BOOLEAN,
  p_offer TEXT DEFAULT NULL,
  p_page_title TEXT DEFAULT NULL,
  p_source_url TEXT DEFAULT NULL,
  p_source_path TEXT DEFAULT NULL,
  p_checkout_url TEXT DEFAULT NULL,
  p_visitor_id TEXT DEFAULT NULL,
  p_affid TEXT DEFAULT NULL,
  p_hid TEXT DEFAULT NULL,
  p_hcid TEXT DEFAULT NULL,
  p_subid TEXT DEFAULT NULL,
  p_subid2 TEXT DEFAULT NULL,
  p_subid3 TEXT DEFAULT NULL,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_lead_id UUID;
  v_clean_name TEXT;
  v_clean_email TEXT;
  v_clean_phone TEXT;
  v_clean_country_code TEXT;
  v_clean_dial_code TEXT;
  v_clean_product TEXT;
  v_clean_page_type TEXT;
  v_clean_offer TEXT;
  v_clean_visitor_id TEXT;
  v_clean_affid TEXT;
  v_clean_hid TEXT;
  v_clean_hcid TEXT;
  v_clean_subid TEXT;
  v_clean_subid2 TEXT;
  v_clean_subid3 TEXT;
  v_clean_utm_source TEXT;
  v_clean_utm_medium TEXT;
  v_clean_utm_campaign TEXT;
  v_clean_utm_content TEXT;
  v_clean_utm_term TEXT;
  v_clean_referrer TEXT;
  v_clean_page_title TEXT;
  v_clean_source_url TEXT;
  v_clean_source_path TEXT;
  v_checkout_host TEXT;
  v_checkout_path TEXT;
  v_existing_id UUID;
BEGIN
  -- 1. Sanitização e Normalização sem Fallbacks Omissores
  v_clean_name := trim(COALESCE(p_name, ''));
  v_clean_email := lower(trim(COALESCE(p_email, '')));
  v_clean_phone := trim(COALESCE(p_phone, ''));
  v_clean_country_code := UPPER(trim(COALESCE(p_country_code, '')));
  v_clean_dial_code := trim(COALESCE(p_dial_code, ''));
  v_clean_product := lower(trim(COALESCE(p_product, '')));
  v_clean_page_type := lower(trim(COALESCE(p_page_type, '')));
  v_clean_offer := trim(COALESCE(p_offer, ''));
  v_clean_visitor_id := trim(COALESCE(p_visitor_id, ''));
  v_clean_affid := trim(COALESCE(p_affid, ''));
  v_clean_hid := trim(COALESCE(p_hid, ''));
  v_clean_hcid := trim(COALESCE(p_hcid, ''));
  v_clean_subid := trim(COALESCE(p_subid, ''));
  v_clean_subid2 := trim(COALESCE(p_subid2, ''));
  v_clean_subid3 := trim(COALESCE(p_subid3, ''));
  v_clean_utm_source := trim(COALESCE(p_utm_source, ''));
  v_clean_utm_medium := trim(COALESCE(p_utm_medium, ''));
  v_clean_utm_campaign := trim(COALESCE(p_utm_campaign, ''));
  v_clean_utm_content := trim(COALESCE(p_utm_content, ''));
  v_clean_utm_term := trim(COALESCE(p_utm_term, ''));
  v_clean_referrer := trim(COALESCE(p_referrer, ''));
  v_clean_page_title := trim(COALESCE(p_page_title, ''));
  v_clean_source_url := trim(COALESCE(p_source_url, ''));
  v_clean_source_path := trim(COALESCE(p_source_path, ''));

  -- 2. Validações Estritas de Consentimento e Campos Obrigatórios
  IF p_consent_given IS NOT TRUE THEN
    RAISE EXCEPTION 'Explicit consent is required.';
  END IF;

  IF v_clean_name = '' OR v_clean_email = '' OR v_clean_phone = '' OR v_clean_country_code = '' OR v_clean_dial_code = '' OR v_clean_product = '' OR v_clean_page_type = '' THEN
    RAISE EXCEPTION 'Mandatory fields cannot be empty.';
  END IF;

  -- 3. Validação de Limites de Tamanho, Caracteres HTML e Formatos
  IF char_length(v_clean_name) < 2 OR char_length(v_clean_name) > 120 OR v_clean_name ~ '[<>]' THEN
    RAISE EXCEPTION 'Invalid name length or format.';
  END IF;

  IF char_length(v_clean_email) > 150 OR v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format or length.';
  END IF;

  IF char_length(v_clean_phone) > 16 OR v_clean_phone !~ '^[+][1-9][0-9]{7,14}$' THEN
    RAISE EXCEPTION 'Invalid E.164 phone format or length.';
  END IF;

  IF v_clean_country_code NOT IN ('US', 'CA', 'GB', 'AU', 'NZ') THEN
    RAISE EXCEPTION 'Invalid country code.';
  END IF;

  IF v_clean_dial_code NOT IN ('+1', '+44', '+61', '+64') THEN
    RAISE EXCEPTION 'Invalid dial code.';
  END IF;

  IF (v_clean_country_code IN ('US', 'CA') AND v_clean_dial_code <> '+1') OR
     (v_clean_country_code = 'GB' AND v_clean_dial_code <> '+44') OR
     (v_clean_country_code = 'AU' AND v_clean_dial_code <> '+61') OR
     (v_clean_country_code = 'NZ' AND v_clean_dial_code <> '+64') THEN
    RAISE EXCEPTION 'Country code and dial code mismatch.';
  END IF;

  IF left(v_clean_phone, char_length(v_clean_dial_code)) <> v_clean_dial_code THEN
    RAISE EXCEPTION 'Phone must start with selected dial code.';
  END IF;

  IF v_clean_product NOT IN ('slimsoda', 'sonnus', 'crowned', 'linfaflow', 'memoflow') THEN
    RAISE EXCEPTION 'Invalid product scope.';
  END IF;

  IF v_clean_page_type NOT IN ('pdp', 'listicle', 'adv', 'power') THEN
    RAISE EXCEPTION 'Invalid page_type scope.';
  END IF;

  -- MemoFlow restrito a adv e power
  IF v_clean_product = 'memoflow' AND v_clean_page_type NOT IN ('adv', 'power') THEN
    RAISE EXCEPTION 'MemoFlow is only allowed on adv and power page types.';
  END IF;

  -- Validação de limites contextuais
  IF char_length(v_clean_visitor_id) > 128 OR v_clean_visitor_id ~ '[<>]' THEN
    RAISE EXCEPTION 'Invalid visitor_id.';
  END IF;

  IF char_length(v_clean_offer) > 100 OR v_clean_offer ~ '[<>]' THEN
    RAISE EXCEPTION 'Invalid offer length or HTML characters detected.';
  END IF;

  IF char_length(v_clean_page_title) > 300 OR v_clean_page_title ~ '[<>]' THEN
    RAISE EXCEPTION 'Invalid page_title length or HTML characters detected.';
  END IF;

  IF char_length(v_clean_affid) > 255 OR v_clean_affid ~ '[<>]' OR
     char_length(v_clean_hid) > 2048 OR v_clean_hid ~ '[<>]' OR
     char_length(v_clean_hcid) > 255 OR v_clean_hcid ~ '[<>]' OR
     char_length(v_clean_subid) > 255 OR v_clean_subid ~ '[<>]' OR
     char_length(v_clean_subid2) > 255 OR v_clean_subid2 ~ '[<>]' OR
     char_length(v_clean_subid3) > 255 OR v_clean_subid3 ~ '[<>]' OR
     char_length(v_clean_utm_source) > 500 OR v_clean_utm_source ~ '[<>]' OR
     char_length(v_clean_utm_medium) > 500 OR v_clean_utm_medium ~ '[<>]' OR
     char_length(v_clean_utm_campaign) > 500 OR v_clean_utm_campaign ~ '[<>]' OR
     char_length(v_clean_utm_content) > 500 OR v_clean_utm_content ~ '[<>]' OR
     char_length(v_clean_utm_term) > 500 OR v_clean_utm_term ~ '[<>]' OR
     char_length(v_clean_referrer) > 2048 OR v_clean_referrer ~ '[<>]' THEN
    RAISE EXCEPTION 'Invalid parameter length or forbidden characters.';
  END IF;

  -- 4. Validação de Protocolo, Userinfo, Matriz de Domínios por Produto e Endpoint checkout.php
  IF p_checkout_url IS NULL OR char_length(p_checkout_url) > 4096 OR p_checkout_url !~* '^https://' THEN
    RAISE EXCEPTION 'Checkout URL must use HTTPS and respect max length.';
  END IF;

  IF p_checkout_url ~* '^https://[^/@]+@' THEN
    RAISE EXCEPTION 'Userinfo in checkout URL is not allowed.';
  END IF;

  v_checkout_host := lower(substring(p_checkout_url from '^https://([^/:]+)'));

  IF v_clean_product = 'slimsoda' AND v_checkout_host NOT IN ('cc.slimsodapowder.com') THEN
    RAISE EXCEPTION 'Invalid checkout host for slimsoda.';
  END IF;

  IF v_clean_product = 'sonnus' AND v_checkout_host NOT IN ('cc.sonnus.com', 'cc.usesonnus.com') THEN
    RAISE EXCEPTION 'Invalid checkout host for sonnus.';
  END IF;

  IF v_clean_product = 'crowned' AND v_checkout_host NOT IN ('cc.crownedhair.com', 'cc.usecrowned.com') THEN
    RAISE EXCEPTION 'Invalid checkout host for crowned.';
  END IF;

  IF v_clean_product = 'linfaflow' AND v_checkout_host NOT IN ('cc.linfaflow.com') THEN
    RAISE EXCEPTION 'Invalid checkout host for linfaflow.';
  END IF;

  IF v_clean_product = 'memoflow' AND v_checkout_host NOT IN ('cc.memoflow.com', 'cc.usememoflow.com') THEN
    RAISE EXCEPTION 'Invalid checkout host for memoflow.';
  END IF;

  v_checkout_path := lower(substring(p_checkout_url from '^https://[^/]+(/[^?#]*)'));

  IF v_checkout_path IS NULL OR (v_checkout_path !~ '/checkout\.php$' AND v_checkout_path !~ '/checkout\.php/') THEN
    RAISE EXCEPTION 'Invalid checkout endpoint path.';
  END IF;

  -- 5. Deduplicação de Curta Janela (60s) considerando Produto, Oferta e Lead (Telefone, E-mail ou Visitor ID)
  SELECT id INTO v_existing_id
  FROM public.checkout_leads
  WHERE product = v_clean_product
    AND lower(trim(COALESCE(offer, ''))) = lower(v_clean_offer)
    AND (
      phone = v_clean_phone
      OR lower(email) = v_clean_email
      OR (v_clean_visitor_id <> '' AND visitor_id = v_clean_visitor_id)
    )
    AND created_at >= (now() - INTERVAL '60 seconds')
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'id', v_existing_id, 'deduplicated', true);
  END IF;

  -- 6. Inserção Segura do Lead
  INSERT INTO public.checkout_leads (
    name,
    email,
    phone,
    country_code,
    dial_code,
    source,
    product,
    page_type,
    offer,
    page_title,
    source_url,
    source_path,
    checkout_url,
    visitor_id,
    affid,
    hid,
    hcid,
    subid,
    subid2,
    subid3,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer,
    consent_given,
    consent_at
  ) VALUES (
    v_clean_name,
    v_clean_email,
    v_clean_phone,
    v_clean_country_code,
    v_clean_dial_code,
    'checkout_form',
    v_clean_product,
    v_clean_page_type,
    NULLIF(v_clean_offer, ''),
    NULLIF(v_clean_page_title, ''),
    NULLIF(v_clean_source_url, ''),
    NULLIF(v_clean_source_path, ''),
    p_checkout_url,
    NULLIF(v_clean_visitor_id, ''),
    NULLIF(v_clean_affid, ''),
    NULLIF(v_clean_hid, ''),
    NULLIF(v_clean_hcid, ''),
    NULLIF(v_clean_subid, ''),
    NULLIF(v_clean_subid2, ''),
    NULLIF(v_clean_subid3, ''),
    NULLIF(v_clean_utm_source, ''),
    NULLIF(v_clean_utm_medium, ''),
    NULLIF(v_clean_utm_campaign, ''),
    NULLIF(v_clean_utm_content, ''),
    NULLIF(v_clean_utm_term, ''),
    NULLIF(v_clean_referrer, ''),
    true,
    now()
  ) RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object('success', true, 'id', v_lead_id);
END;
$$;

-- 7. REVOGAR EXECUTE DE PUBLIC E CONCEDER APENAS PARA anon E authenticated
REVOKE ALL ON FUNCTION public.save_checkout_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_checkout_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_checkout_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
