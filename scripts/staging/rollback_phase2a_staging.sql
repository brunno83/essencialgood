-- ============================================================================
-- ESSENCIAL GOOD - STAGING ROLLBACK SCRIPT: PHASE 2A SECURITY INFRASTRUCTURE
-- Target Project Ref: zauvpsxeexwthobmbkku (STAGING ONLY)
-- Safe, Idempotent Rollback of Phase 2A database objects
-- ============================================================================

BEGIN;

-- 1. Remoção do Trigger antes da função correspondente
DROP TRIGGER IF EXISTS trg_enforce_push_subscriptions_limit ON public.push_subscriptions;

-- 2. Remoção das Funções com Assinaturas Exatas
DROP FUNCTION IF EXISTS public.enforce_max_push_subscriptions() CASCADE;
DROP FUNCTION IF EXISTS public.p_create_visitor_conversation(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.p_send_visitor_message(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_rate_limits() CASCADE;
DROP FUNCTION IF EXISTS public.consume_rate_limit(character varying, character varying, integer, integer) CASCADE;

-- 3. Remoção da Tabela Privada de Rate Limits
DROP TABLE IF EXISTS public.security_rate_limits CASCADE;

COMMIT;
