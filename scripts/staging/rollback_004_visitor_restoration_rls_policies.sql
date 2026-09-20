-- ============================================================================
-- ESSENCIAL GOOD - ROLLBACK PATCH 004: VISITOR RESTORATION RLS POLICIES
-- Target Project Ref STAGING: zauvpsxeexwthobmbkku
-- FORBIDDEN Project Ref PRODUÇÃO: axgpmpnipwyfirlplbjv
-- ============================================================================

BEGIN;

DROP POLICY IF EXISTS "conversations_visitor_select_policy" ON public.conversations;
DROP POLICY IF EXISTS "messages_visitor_select_policy" ON public.messages;

COMMIT;
