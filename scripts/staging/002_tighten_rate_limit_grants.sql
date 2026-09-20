-- ============================================================================
-- ESSENCIAL GOOD - STAGING PATCH 002: TIGHTEN RATE LIMIT TABLE GRANTS
-- Target Project Ref: zauvpsxeexwthobmbkku (STAGING ONLY)
-- Removes TRUNCATE, REFERENCES, and TRIGGER from service_role on security_rate_limits
-- ============================================================================

BEGIN;

REVOKE ALL ON TABLE public.security_rate_limits
FROM PUBLIC, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.security_rate_limits
TO service_role;

COMMIT;
