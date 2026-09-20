-- ============================================================================
-- ESSENCIAL GOOD - STAGING BOOTSTRAP: MINIMAL SCHEMA FOR PHASE 2A (001 - 009)
-- Project Ref Target: zauvpsxeexwthobmbkku (STAGING ONLY)
-- Safe, Idempotent, Zero PII, Zero Secrets, Zero Production Webhooks
-- ============================================================================

-- 1. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. HELPER FUNCTIONS: is_admin & is_admin_or_agent
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_agent()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'agent')
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

REVOKE EXECUTE ON FUNCTION public.is_admin_or_agent() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_or_agent() TO authenticated, anon;

-- 3. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL REFERENCES auth.users(id),
    visitor_name TEXT,
    visitor_email TEXT,
    visitor_phone TEXT,
    visitor_country_code VARCHAR(2),
    visitor_dial_code VARCHAR(6),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
    assigned_admin_id UUID REFERENCES public.admin_profiles(id),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source_url TEXT,
    source_path TEXT,
    source_host TEXT,
    source_title TEXT,
    source_product TEXT,
    archived_at TIMESTAMPTZ NULL,
    archived_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    CONSTRAINT chk_conversations_source_url_valid CHECK (
        source_url IS NULL OR (
            length(source_url) <= 2048 AND
            source_url ~* '^https?://(essencialgood\.com|www\.essencialgood\.com|[a-z0-9-]+\.essencialgood\.com|localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$'
        )
    ),
    CONSTRAINT chk_conversations_source_path_valid CHECK (
        source_path IS NULL OR (length(source_path) <= 1024 AND source_path ~ '^/')
    ),
    CONSTRAINT chk_conversations_source_host_valid CHECK (
        source_host IS NULL OR (
            length(source_host) <= 253 AND source_host !~ '\s' AND
            (source_host IN ('essencialgood.com', 'www.essencialgood.com', 'localhost', '127.0.0.1') OR source_host ~ '^[a-z0-9-]+\.essencialgood\.com$')
        )
    ),
    CONSTRAINT chk_conversations_source_title_length CHECK (source_title IS NULL OR length(source_title) <= 300),
    CONSTRAINT chk_conversations_source_product_length CHECK (source_product IS NULL OR length(source_product) <= 100),
    CONSTRAINT chk_conversations_country_code CHECK (visitor_country_code IS NULL OR visitor_country_code IN ('US', 'CA', 'GB', 'AU', 'NZ')),
    CONSTRAINT chk_conversations_dial_code CHECK (visitor_dial_code IS NULL OR visitor_dial_code IN ('+1', '+44', '+61', '+64')),
    CONSTRAINT chk_conversations_e164_phone CHECK (visitor_phone IS NULL OR visitor_phone ~ '^[+][1-9][0-9]{7,14}$'),
    CONSTRAINT chk_conversations_country_dial_alignment CHECK (
        (visitor_country_code = 'US' AND visitor_dial_code = '+1') OR
        (visitor_country_code = 'CA' AND visitor_dial_code = '+1') OR
        (visitor_country_code = 'GB' AND visitor_dial_code = '+44') OR
        (visitor_country_code = 'AU' AND visitor_dial_code = '+61') OR
        (visitor_country_code = 'NZ' AND visitor_dial_code = '+64') OR
        (visitor_country_code IS NULL AND visitor_dial_code IS NULL)
    ),
    CONSTRAINT chk_conversations_phone_triad_complete CHECK (
        (visitor_phone IS NULL AND visitor_country_code IS NULL AND visitor_dial_code IS NULL) OR
        (visitor_phone IS NOT NULL AND visitor_country_code IS NOT NULL AND visitor_dial_code IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON public.conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_visitor_conversation ON public.conversations (visitor_id) WHERE status IN ('open', 'pending');

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'admin', 'agent')),
    content TEXT NOT NULL CHECK (length(trim(content)) BETWEEN 1 AND 4000),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON public.messages(conversation_id, created_at DESC);

-- 5. CHAT SETTINGS TABLE (SINGLETON)
CREATE TABLE IF NOT EXISTS public.chat_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'default',
  header_title TEXT NOT NULL DEFAULT 'Essencial Good',
  header_subtitle TEXT NOT NULL DEFAULT 'Live Support',
  form_title TEXT NOT NULL DEFAULT 'Chat with Essencial Good',
  form_subtitle TEXT NOT NULL DEFAULT 'Fill in the details below to start your live chat with our team.',
  agent_name TEXT NOT NULL DEFAULT 'Essencial Good Team',
  avatar_url TEXT DEFAULT '/assets/Brand/essencial-good-symbol.png',
  welcome_message TEXT NOT NULL DEFAULT 'Hello! How can we help you today?',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  phone_required BOOLEAN NOT NULL DEFAULT true,
  email_required BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chat_settings_singleton_chk CHECK (id = 'default'),
  CONSTRAINT chat_settings_at_least_one_contact_chk CHECK (phone_required = true OR email_required = true)
);

INSERT INTO public.chat_settings (id, phone_required, email_required)
VALUES ('default', true, false)
ON CONFLICT (id) DO NOTHING;

-- 6. CHECKOUT LEADS TABLE
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
  CONSTRAINT check_checkout_lead_phone_triad CHECK (
    phone IS NOT NULL AND country_code IS NOT NULL AND dial_code IS NOT NULL
    AND ((country_code IN ('US', 'CA') AND dial_code = '+1') OR (country_code = 'GB' AND dial_code = '+44') OR (country_code = 'AU' AND dial_code = '+61') OR (country_code = 'NZ' AND dial_code = '+64'))
    AND phone LIKE (dial_code || '%')
  ),
  CONSTRAINT check_checkout_lead_memoflow_pages CHECK (product <> 'memoflow' OR page_type IN ('adv', 'power'))
);

CREATE INDEX IF NOT EXISTS idx_checkout_leads_created_at ON public.checkout_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_leads_phone ON public.checkout_leads (phone);

-- 7. PUSH SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    notify_chats BOOLEAN NOT NULL DEFAULT true,
    notify_leads BOOLEAN NOT NULL DEFAULT true,
    enabled BOOLEAN NOT NULL DEFAULT true,
    failed_count INTEGER NOT NULL DEFAULT 0,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint),
    CONSTRAINT check_push_endpoint_length CHECK (char_length(endpoint) <= 2048),
    CONSTRAINT check_push_endpoint_https CHECK (endpoint ~* '^https://')
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_enabled ON public.push_subscriptions(enabled) WHERE enabled = true;

-- 8. RLS ENABLING
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. BASE RPC: save_checkout_lead
CREATE OR REPLACE FUNCTION public.save_checkout_lead(
  p_name TEXT, p_email TEXT, p_phone TEXT, p_country_code TEXT, p_dial_code TEXT,
  p_product TEXT, p_page_type TEXT, p_consent_given BOOLEAN, p_offer TEXT DEFAULT NULL,
  p_page_title TEXT DEFAULT NULL, p_source_url TEXT DEFAULT NULL, p_source_path TEXT DEFAULT NULL,
  p_checkout_url TEXT DEFAULT NULL, p_visitor_id TEXT DEFAULT NULL, p_affid TEXT DEFAULT NULL,
  p_hid TEXT DEFAULT NULL, p_hcid TEXT DEFAULT NULL, p_subid TEXT DEFAULT NULL,
  p_subid2 TEXT DEFAULT NULL, p_subid3 TEXT DEFAULT NULL, p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL, p_utm_campaign TEXT DEFAULT NULL, p_utm_content TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL, p_referrer TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_lead_id UUID;
  v_clean_name TEXT := trim(COALESCE(p_name, ''));
  v_clean_email TEXT := lower(trim(COALESCE(p_email, '')));
  v_clean_phone TEXT := trim(COALESCE(p_phone, ''));
  v_clean_country_code TEXT := UPPER(trim(COALESCE(p_country_code, '')));
  v_clean_dial_code TEXT := trim(COALESCE(p_dial_code, ''));
  v_clean_product TEXT := lower(trim(COALESCE(p_product, '')));
  v_clean_page_type TEXT := lower(trim(COALESCE(p_page_type, '')));
  v_existing_id UUID;
BEGIN
  IF p_consent_given IS NOT TRUE THEN
    RAISE EXCEPTION 'Explicit consent is required.';
  END IF;
  IF v_clean_name = '' OR v_clean_email = '' OR v_clean_phone = '' THEN
    RAISE EXCEPTION 'Mandatory fields cannot be empty.';
  END IF;

  SELECT id INTO v_existing_id
  FROM public.checkout_leads
  WHERE product = v_clean_product
    AND (phone = v_clean_phone OR lower(email) = v_clean_email)
    AND created_at >= (now() - INTERVAL '60 seconds')
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'id', v_existing_id, 'deduplicated', true);
  END IF;

  INSERT INTO public.checkout_leads (
    name, email, phone, country_code, dial_code, source, product, page_type, checkout_url, consent_given, consent_at
  ) VALUES (
    v_clean_name, v_clean_email, v_clean_phone, v_clean_country_code, v_clean_dial_code, 'checkout_form',
    v_clean_product, v_clean_page_type, COALESCE(p_checkout_url, 'https://cc.slimsodapowder.com/checkout.php'), true, now()
  ) RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object('success', true, 'id', v_lead_id);
END;
$$;

REVOKE ALL ON FUNCTION public.save_checkout_lead FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_checkout_lead TO anon, authenticated;
