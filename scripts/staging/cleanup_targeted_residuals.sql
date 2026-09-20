-- Targeted Cleanup Script for Synthetic Test Residuals
BEGIN;

-- 1. Conversas dos usuários sintéticos anônimos do harness
DELETE FROM public.conversations
WHERE visitor_id IN (
  SELECT id FROM auth.users WHERE is_anonymous = true OR email IS NULL OR email = '' OR email LIKE '%@example.invalid'
);

-- 2. Leads sintéticos com domínio do harness
DELETE FROM public.checkout_leads
WHERE email LIKE '%@example.invalid';

-- 3. Buckets sintéticos de rate limit
DELETE FROM public.security_rate_limits;

-- 4. Assinaturas push de usuários sintéticos (se houver)
DELETE FROM public.push_subscriptions;

-- 5. Usuários sintéticos anônimos do harness
DELETE FROM auth.users
WHERE is_anonymous = true OR email IS NULL OR email = '' OR email LIKE '%@example.invalid';

COMMIT;
