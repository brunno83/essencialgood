-- Migration: 004_chat_settings_and_phone.sql
-- Description: Singleton chat settings table, hardened RLS policies using public.is_admin(), Storage bucket for avatars, RPC public endpoint, and visitor phone constraints

-- ==========================================
-- 1. CHAT SETTINGS TABLE (SINGLETON)
-- ==========================================
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
  CONSTRAINT chat_settings_at_least_one_contact_chk CHECK (phone_required = true OR email_required = true),
  CONSTRAINT chat_settings_header_title_chk CHECK (char_length(btrim(header_title)) BETWEEN 1 AND 80),
  CONSTRAINT chat_settings_header_subtitle_chk CHECK (char_length(btrim(header_subtitle)) BETWEEN 1 AND 120),
  CONSTRAINT chat_settings_form_title_chk CHECK (char_length(btrim(form_title)) BETWEEN 1 AND 120),
  CONSTRAINT chat_settings_form_subtitle_chk CHECK (char_length(btrim(form_subtitle)) BETWEEN 1 AND 300),
  CONSTRAINT chat_settings_agent_name_chk CHECK (char_length(btrim(agent_name)) BETWEEN 1 AND 80),
  CONSTRAINT chat_settings_welcome_msg_chk CHECK (char_length(btrim(welcome_message)) BETWEEN 1 AND 500),
  CONSTRAINT chat_settings_avatar_url_chk CHECK (avatar_url IS NULL OR (char_length(btrim(avatar_url)) >= 1 AND length(avatar_url) <= 2048))
);

-- Insert singleton default row
INSERT INTO public.chat_settings (id, phone_required, email_required)
VALUES ('default', true, false)
ON CONFLICT (id) DO NOTHING;

-- Standard trigger function (non-SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_chat_settings_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_chat_settings_update ON public.chat_settings;
CREATE TRIGGER trg_chat_settings_update
  BEFORE UPDATE ON public.chat_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_chat_settings_update();

-- Enable RLS on chat_settings
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;

-- Grants for chat_settings table
GRANT SELECT ON public.chat_settings TO anon, authenticated;
GRANT UPDATE ON public.chat_settings TO authenticated;

-- Policies:
-- Direct SELECT policy for chat_settings (required for Supabase Realtime subscriptions to listen for UPDATE events)
DROP POLICY IF EXISTS "Allow public read access to chat_settings" ON public.chat_settings;
CREATE POLICY "Allow public read access to chat_settings"
  ON public.chat_settings
  FOR SELECT
  USING (true);

-- ONLY authenticated users with role='admin' via public.is_admin() can UPDATE chat_settings
DROP POLICY IF EXISTS "Allow admin write access to chat_settings" ON public.chat_settings;
CREATE POLICY "Allow admin write access to chat_settings"
  ON public.chat_settings
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    public.is_admin()
  )
  WITH CHECK (
    id = 'default' AND
    auth.role() = 'authenticated' AND
    public.is_admin()
  );

-- ==========================================
-- 2. PUBLIC SECURE RPC FOR PRIVACY
-- ==========================================
CREATE OR REPLACE FUNCTION public.get_public_chat_settings()
RETURNS TABLE (
  header_title TEXT,
  header_subtitle TEXT,
  form_title TEXT,
  form_subtitle TEXT,
  agent_name TEXT,
  avatar_url TEXT,
  welcome_message TEXT,
  is_enabled BOOLEAN,
  phone_required BOOLEAN,
  email_required BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.header_title,
    s.header_subtitle,
    s.form_title,
    s.form_subtitle,
    s.agent_name,
    s.avatar_url,
    s.welcome_message,
    s.is_enabled,
    s.phone_required,
    s.email_required
  FROM public.chat_settings s
  WHERE s.id = 'default'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.get_public_chat_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_chat_settings() TO anon, authenticated;

-- ==========================================
-- 3. CONVERSATIONS PHONE COLUMNS & IDEMPOTENT CONSTRAINTS
-- ==========================================
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS visitor_phone TEXT,
  ADD COLUMN IF NOT EXISTS visitor_country_code VARCHAR(2),
  ADD COLUMN IF NOT EXISTS visitor_dial_code VARCHAR(6);

-- Index for phone queries
CREATE INDEX IF NOT EXISTS idx_conversations_visitor_phone
  ON public.conversations (visitor_phone)
  WHERE visitor_phone IS NOT NULL;

-- Idempotent constraint additions checking conrelid and conname
DO $$ 
BEGIN
  -- Country Code Constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.conversations'::regclass AND conname = 'chk_conversations_country_code'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT chk_conversations_country_code
      CHECK (visitor_country_code IS NULL OR visitor_country_code IN ('US', 'CA', 'GB', 'AU', 'NZ'));
  END IF;

  -- Dial Code Constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.conversations'::regclass AND conname = 'chk_conversations_dial_code'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT chk_conversations_dial_code
      CHECK (visitor_dial_code IS NULL OR visitor_dial_code IN ('+1', '+44', '+61', '+64'));
  END IF;

  -- E.164 Format Constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.conversations'::regclass AND conname = 'chk_conversations_e164_phone'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT chk_conversations_e164_phone
      CHECK (
        visitor_phone IS NULL
        OR visitor_phone ~ '^[+][1-9][0-9]{7,14}$'
      );
  END IF;

  -- Country & Dial Code Alignment Pair Constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.conversations'::regclass AND conname = 'chk_conversations_country_dial_alignment'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT chk_conversations_country_dial_alignment
      CHECK (
        (visitor_country_code = 'US' AND visitor_dial_code = '+1') OR
        (visitor_country_code = 'CA' AND visitor_dial_code = '+1') OR
        (visitor_country_code = 'GB' AND visitor_dial_code = '+44') OR
        (visitor_country_code = 'AU' AND visitor_dial_code = '+61') OR
        (visitor_country_code = 'NZ' AND visitor_dial_code = '+64') OR
        (visitor_country_code IS NULL AND visitor_dial_code IS NULL)
      );
  END IF;

  -- All-NULL or All-Filled Triad Constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.conversations'::regclass AND conname = 'chk_conversations_phone_triad_complete'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT chk_conversations_phone_triad_complete
      CHECK (
        (visitor_phone IS NULL AND visitor_country_code IS NULL AND visitor_dial_code IS NULL) OR
        (visitor_phone IS NOT NULL AND visitor_country_code IS NOT NULL AND visitor_dial_code IS NOT NULL)
      );
  END IF;
END $$;

-- ==========================================
-- 4. STORAGE BUCKET & SEPARATED POLICIES FOR AVATARS
-- ==========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-assets',
  'chat-assets',
  true,
  2097152, -- 2 MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- Separate Storage RLS Policies for avatars/ subfolder using public.is_admin():

-- 4.1 SELECT (Public Read for avatars/ folder in chat-assets)
DROP POLICY IF EXISTS "Public Read avatars in chat-assets" ON storage.objects;
CREATE POLICY "Public Read avatars in chat-assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'chat-assets' AND
    (storage.foldername(name))[1] = 'avatars'
  );

-- 4.2 INSERT (Admin only for avatars/ folder in chat-assets)
DROP POLICY IF EXISTS "Admin Insert avatars in chat-assets" ON storage.objects;
CREATE POLICY "Admin Insert avatars in chat-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-assets' AND
    (storage.foldername(name))[1] = 'avatars' AND
    auth.role() = 'authenticated' AND
    public.is_admin()
  );

-- 4.3 UPDATE (Admin only for avatars/ folder in chat-assets)
DROP POLICY IF EXISTS "Admin Update avatars in chat-assets" ON storage.objects;
CREATE POLICY "Admin Update avatars in chat-assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'chat-assets' AND
    (storage.foldername(name))[1] = 'avatars' AND
    auth.role() = 'authenticated' AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'chat-assets' AND
    (storage.foldername(name))[1] = 'avatars' AND
    auth.role() = 'authenticated' AND
    public.is_admin()
  );

-- 4.4 DELETE (Admin only for avatars/ folder in chat-assets)
DROP POLICY IF EXISTS "Admin Delete avatars in chat-assets" ON storage.objects;
CREATE POLICY "Admin Delete avatars in chat-assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-assets' AND
    (storage.foldername(name))[1] = 'avatars' AND
    auth.role() = 'authenticated' AND
    public.is_admin()
  );

-- ==========================================
-- 5. REALTIME PUBLICATION
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_settings;
  END IF;
END $$;
