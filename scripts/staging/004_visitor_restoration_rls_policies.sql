-- ============================================================================
-- ESSENCIAL GOOD - STAGING PATCH 004: VISITOR RESTORATION RLS POLICIES
-- Target Project Ref STAGING: zauvpsxeexwthobmbkku
-- FORBIDDEN Project Ref PRODUÇÃO: axgpmpnipwyfirlplbjv
-- ============================================================================

BEGIN;

-- 1. POLÍTICA DE LEITURA (SELECT) EM CONVERSATIONS PARA VISITANTE AUTENTICADO
DROP POLICY IF EXISTS "conversations_visitor_select_policy" ON public.conversations;

CREATE POLICY "conversations_visitor_select_policy"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (visitor_id = (select auth.uid()));

-- 2. POLÍTICA DE LEITURA (SELECT) EM MESSAGES PARA VISITANTE AUTENTICADO
DROP POLICY IF EXISTS "messages_visitor_select_policy" ON public.messages;

CREATE POLICY "messages_visitor_select_policy"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.visitor_id = (select auth.uid())
    )
  );

-- 3. INCLUSÃO DAS TABELAS NA PUBLICAÇÃO DO SUPABASE REALTIME
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

COMMENT ON POLICY "conversations_visitor_select_policy" ON public.conversations IS
  'Permite restauração e consulta de conversa pelo próprio visitante via visitor_id = auth.uid()';

COMMENT ON POLICY "messages_visitor_select_policy" ON public.messages IS
  'Permite leitura de mensagens pelo visitante via validação da conversa pertencente a visitor_id = auth.uid()';

COMMIT;
