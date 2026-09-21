-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 012: DEPRECATE LEGACY DIRECT VISITOR RLS POLICIES
-- ============================================================================
-- Esta migration remove pontualmente as 4 políticas legadas que permitiam
-- inserção e leitura diretas de visitantes via cliente PostgREST REST API,
-- concluindo a transição do chat de visitantes para Edge Functions + Service Role.
--
-- POLÍTICAS REMOVIDAS:
-- 1. "visitor_insert_own_conversation" ON public.conversations
-- 2. "visitor_select_own_conversation" ON public.conversations
-- 3. "visitor_insert_own_message" ON public.messages
-- 4. "visitor_select_own_messages" ON public.messages
--
-- GARANTIAS DE SEGURANÇA:
-- - Preserva integralmente todas as políticas administrativas (is_admin_or_agent).
-- - Preserva as políticas de leitura otimizadas da Migration 011:
--   - "conversations_visitor_select_policy" (TO authenticated USING (visitor_id = (select auth.uid())))
--   - "messages_visitor_select_policy" (TO authenticated USING (EXISTS (...)))
-- - Zero alteração de dados (sem DELETE, UPDATE ou TRUNCATE de registros).
-- ============================================================================

BEGIN;

-- 1. REMOÇÃO DAS POLÍTICAS LEGADAS DA TABELA CONVERSATIONS
DROP POLICY IF EXISTS "visitor_insert_own_conversation" ON public.conversations;
DROP POLICY IF EXISTS "visitor_select_own_conversation" ON public.conversations;

-- 2. REMOÇÃO DAS POLÍTICAS LEGADAS DA TABELA MESSAGES
DROP POLICY IF EXISTS "visitor_insert_own_message" ON public.messages;
DROP POLICY IF EXISTS "visitor_select_own_messages" ON public.messages;

COMMENT ON TABLE public.conversations IS
  'Conversas do chat. Escrita de visitantes restrita a Edge Functions (service_role via p_create_visitor_conversation). Leitura via conversations_visitor_select_policy e admin_select_all_conversations.';

COMMENT ON TABLE public.messages IS
  'Mensagens do chat. Escrita de visitantes restrita a Edge Functions (service_role via p_send_visitor_message). Leitura via messages_visitor_select_policy e admin_select_all_messages.';

COMMIT;

-- ============================================================================
-- SQL DE ROLLBACK IDEMPOTENTE PARA REINTEGRAÇÃO DAS 4 POLÍTICAS LEGADAS
-- ============================================================================
/*
BEGIN;

-- 1. RECRIAR POLÍTICAS LEGADAS EM CONVERSATIONS
DROP POLICY IF EXISTS "visitor_insert_own_conversation" ON public.conversations;
CREATE POLICY "visitor_insert_own_conversation"
ON public.conversations FOR INSERT
TO public
WITH CHECK (
    auth.uid() IS NOT NULL
    AND visitor_id = auth.uid()
    AND NOT public.is_admin_or_agent()
);

DROP POLICY IF EXISTS "visitor_select_own_conversation" ON public.conversations;
CREATE POLICY "visitor_select_own_conversation"
ON public.conversations FOR SELECT
TO public
USING (visitor_id = auth.uid());

-- 2. RECRIAR POLÍTICAS LEGADAS EM MESSAGES
DROP POLICY IF EXISTS "visitor_insert_own_message" ON public.messages;
CREATE POLICY "visitor_insert_own_message"
ON public.messages FOR INSERT
TO public
WITH CHECK (
    auth.uid() IS NOT NULL
    AND sender_id = auth.uid()
    AND sender_type = 'visitor'
    AND NOT public.is_admin_or_agent()
    AND EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id
          AND c.visitor_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "visitor_select_own_messages" ON public.messages;
CREATE POLICY "visitor_select_own_messages"
ON public.messages FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id
          AND c.visitor_id = auth.uid()
    )
);

COMMIT;
*/
