-- Controlled Cleanup Script for Phase 2A Staging Test Data
BEGIN;

DELETE FROM public.messages;
DELETE FROM public.conversations;
DELETE FROM public.checkout_leads;
DELETE FROM public.security_rate_limits;

-- Remove synthetic anonymous test users created during testing
DELETE FROM auth.users WHERE email IS NULL OR email LIKE '%@example.invalid' OR email = '';

COMMIT;
