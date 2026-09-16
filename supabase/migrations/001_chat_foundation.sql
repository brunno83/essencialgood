-- Migration 001: Chat Foundation, Security, RLS & Realtime (Refatoração de Integridade Etapa 1)
-- Projeto Essencial Good - Painel Admin & Chat ao Vivo

-- 1. TABELA DE PERFIS DE ADMINISTRADORES / AGENTES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABELA DE CONVERSAS DE VISITANTES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL REFERENCES auth.users(id),
    visitor_name TEXT,
    visitor_email TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
    assigned_admin_id UUID REFERENCES public.admin_profiles(id),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'admin', 'agent')),
    content TEXT NOT NULL CHECK (length(trim(content)) BETWEEN 1 AND 4000),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ÍNDICES DE PERFORMANCE, BUSCA E UNICIDADE
CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON public.conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON public.messages(conversation_id, created_at DESC);

-- Índice único parcial: impede que um visitante possua mais de uma conversa ativa ('open' ou 'pending')
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_visitor_conversation
ON public.conversations (visitor_id)
WHERE status IN ('open', 'pending');

-- 5. FUNÇÕES DE CHECAGEM DE SEGURANÇA (SECURITY DEFINER / STABLE / APENAS AUTH.UID())

-- Helper: Checa se o usuário atual é administrador
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
        SELECT 1 
        FROM public.admin_profiles 
        WHERE id = auth.uid() 
          AND role = 'admin'
    );
END;
$$;

-- Helper: Checa se o usuário atual é administrador ou agente
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
        SELECT 1 
        FROM public.admin_profiles 
        WHERE id = auth.uid() 
          AND role IN ('admin', 'agent')
    );
END;
$$;

-- Concede execução somente a usuários autenticados (inclusive sessões anônimas Supabase Auth)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin_or_agent() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_agent() TO authenticated;

-- 6. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS RLS - admin_profiles
-- SELECT: Administradores veem todos os perfis. Usuários individuais veem apenas o próprio perfil.
DROP POLICY IF EXISTS "select_admin_profiles" ON public.admin_profiles;
CREATE POLICY "select_admin_profiles"
ON public.admin_profiles FOR SELECT
USING (id = auth.uid() OR public.is_admin());

-- INSERT/UPDATE/DELETE: Apenas administradores (role = 'admin')
DROP POLICY IF EXISTS "insert_admin_profiles" ON public.admin_profiles;
CREATE POLICY "insert_admin_profiles"
ON public.admin_profiles FOR INSERT
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_admin_profiles" ON public.admin_profiles;
CREATE POLICY "update_admin_profiles"
ON public.admin_profiles FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_admin_profiles" ON public.admin_profiles;
CREATE POLICY "delete_admin_profiles"
ON public.admin_profiles FOR DELETE
USING (public.is_admin());

-- 8. POLÍTICAS RLS - conversations
-- INSERT por Visitante: cria apenas a própria conversa vinculada ao seu auth.uid()
DROP POLICY IF EXISTS "visitor_insert_own_conversation" ON public.conversations;
CREATE POLICY "visitor_insert_own_conversation"
ON public.conversations FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND visitor_id = auth.uid()
    AND NOT public.is_admin_or_agent()
);

-- SELECT por Visitante: visualiza apenas a própria conversa
DROP POLICY IF EXISTS "visitor_select_own_conversation" ON public.conversations;
CREATE POLICY "visitor_select_own_conversation"
ON public.conversations FOR SELECT
USING (visitor_id = auth.uid());

-- SELECT/UPDATE por Admin e Agent: acesso às conversas para atendimento e atualização operacional
DROP POLICY IF EXISTS "admin_select_all_conversations" ON public.conversations;
CREATE POLICY "admin_select_all_conversations"
ON public.conversations FOR SELECT
USING (public.is_admin_or_agent());

DROP POLICY IF EXISTS "admin_update_all_conversations" ON public.conversations;
CREATE POLICY "admin_update_all_conversations"
ON public.conversations FOR UPDATE
USING (public.is_admin_or_agent())
WITH CHECK (public.is_admin_or_agent());

-- (Removida política de inserção manual de conversas pela equipe. Apenas visitantes iniciam conversas)

-- 9. POLÍTICAS RLS - messages
-- INSERT por Visitante: insere apenas em sua própria conversa, com sender_type = 'visitor'
DROP POLICY IF EXISTS "visitor_insert_own_message" ON public.messages;
CREATE POLICY "visitor_insert_own_message"
ON public.messages FOR INSERT
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

-- SELECT por Visitante: visualiza apenas mensagens das próprias conversas
DROP POLICY IF EXISTS "visitor_select_own_messages" ON public.messages;
CREATE POLICY "visitor_select_own_messages"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id
          AND c.visitor_id = auth.uid()
    )
);

-- INSERT por Equipe (Admin / Agent): garante que sender_type corresponde exatamente ao role cadastrado em admin_profiles
DROP POLICY IF EXISTS "admin_insert_messages" ON public.messages;
CREATE POLICY "admin_insert_messages"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND sender_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.admin_profiles ap
        WHERE ap.id = auth.uid()
          AND ap.role = sender_type
    )
);

-- SELECT por Equipe: visualiza todas as mensagens
DROP POLICY IF EXISTS "admin_select_all_messages" ON public.messages;
CREATE POLICY "admin_select_all_messages"
ON public.messages FOR SELECT
USING (public.is_admin_or_agent());

-- Mensagens são IMUTÁVEIS. Não existem políticas de UPDATE ou DELETE na tabela messages para nenhum usuário.

-- 10. RPC DE SEGURANÇA PARA MARCAR MENSAGENS COMO LIDAS
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_conversation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    -- Se for equipe (admin ou agent), marca como lidas as mensagens do visitante
    IF public.is_admin_or_agent() THEN
        UPDATE public.messages
        SET read_at = now()
        WHERE conversation_id = p_conversation_id
          AND sender_type = 'visitor'
          AND read_at IS NULL;
    ELSE
        -- Se for visitante, verifica se a conversa pertence a ele e marca mensagens enviadas pela equipe
        IF EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = p_conversation_id
              AND visitor_id = v_user_id
        ) THEN
            UPDATE public.messages
            SET read_at = now()
            WHERE conversation_id = p_conversation_id
              AND sender_type IN ('admin', 'agent')
              AND read_at IS NULL;
        ELSE
            RAISE EXCEPTION 'Acesso negado para esta conversa.';
        END IF;
    END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_messages_as_read(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_messages_as_read(UUID) TO authenticated;

-- 11. TRIGGERS E FUNÇÕES INTERNAS DE CONSISTÊNCIA E SANITIZAÇÃO

-- 11.1 Trigger de sanitização e determinação confiável de mensagens no BEFORE INSERT
CREATE OR REPLACE FUNCTION public.normalize_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_user_role TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Autenticação necessária para enviar mensagem.';
    END IF;

    -- Força campos controlados exclusivamente pelo servidor
    NEW.sender_id := v_user_id;
    NEW.created_at := now();
    NEW.read_at := NULL;
    NEW.content := trim(NEW.content);

    IF length(NEW.content) = 0 THEN
        RAISE EXCEPTION 'O conteúdo da mensagem não pode ser vazio ou conter apenas espaços.';
    END IF;

    IF length(NEW.content) > 4000 THEN
        RAISE EXCEPTION 'O conteúdo da mensagem excede o limite de 4000 caracteres.';
    END IF;

    -- Determina o sender_type pelo banco de dados com base no perfil autenticado
    IF public.is_admin() THEN
        NEW.sender_type := 'admin';
    ELSE
        SELECT role INTO v_user_role
        FROM public.admin_profiles
        WHERE id = v_user_id;

        IF v_user_role = 'agent' THEN
            NEW.sender_type := 'agent';
        ELSE
            NEW.sender_type := 'visitor';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_new_message ON public.messages;
CREATE TRIGGER trg_normalize_new_message
    BEFORE INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_new_message();

-- 11.2 Trigger de normalização e sanitização de conversa no BEFORE INSERT (Visitantes)
CREATE OR REPLACE FUNCTION public.normalize_visitor_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin_or_agent() THEN
        NEW.visitor_id := auth.uid();
        NEW.status := 'open';
        NEW.assigned_admin_id := NULL;
        NEW.created_at := now();
        NEW.updated_at := now();
        NEW.last_message_at := now();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_visitor_conversation ON public.conversations;
CREATE TRIGGER trg_normalize_visitor_conversation
    BEFORE INSERT ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_visitor_conversation();

-- 11.3 Trigger de atualização de last_message_at ao criar nova mensagem
CREATE OR REPLACE FUNCTION public.update_conversation_last_message_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_last_message_at ON public.messages;
CREATE TRIGGER trg_update_last_message_at
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_conversation_last_message_at();

-- 11.4 Trigger de proteção contra alteração de campos imutáveis em conversations
CREATE OR REPLACE FUNCTION public.protect_conversation_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. FLUXO INTERNO (disparado por trigger do sistema como update_conversation_last_message_at)
    IF pg_trigger_depth() > 1 THEN
        -- Confirma que NENHUM outro campo além de last_message_at e updated_at foi modificado
        IF OLD.id IS DISTINCT FROM NEW.id OR
           OLD.visitor_id IS DISTINCT FROM NEW.visitor_id OR
           OLD.visitor_name IS DISTINCT FROM NEW.visitor_name OR
           OLD.visitor_email IS DISTINCT FROM NEW.visitor_email OR
           OLD.status IS DISTINCT FROM NEW.status OR
           OLD.assigned_admin_id IS DISTINCT FROM NEW.assigned_admin_id OR
           OLD.created_at IS DISTINCT FROM NEW.created_at THEN
            RAISE EXCEPTION 'Atualização interna de conversa tentou modificar campos restritos.';
        END IF;

        -- Permite apenas a atualização interna de last_message_at e updated_at
        RETURN NEW;
    END IF;

    -- 2. FLUXO DIRETO (requisição direta do cliente via API de UPDATE)
    IF NOT public.is_admin_or_agent() THEN
        RAISE EXCEPTION 'Visitantes não possuem permissão para atualizar conversas.';
    END IF;

    -- Bloqueia alteração direta de last_message_at pelo cliente
    IF OLD.last_message_at IS DISTINCT FROM NEW.last_message_at THEN
        RAISE EXCEPTION 'O campo last_message_at só pode ser atualizado pelo sistema ao inserir mensagens.';
    END IF;

    -- Bloqueia alteração de campos imutáveis no UPDATE direto da equipe
    IF OLD.id IS DISTINCT FROM NEW.id THEN
        RAISE EXCEPTION 'O id da conversa é imutável.';
    END IF;

    IF OLD.visitor_id IS DISTINCT FROM NEW.visitor_id THEN
        RAISE EXCEPTION 'O campo visitor_id é imutável.';
    END IF;

    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
        RAISE EXCEPTION 'O campo created_at é imutável.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_conversation_fields ON public.conversations;
CREATE TRIGGER trg_protect_conversation_fields
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_conversation_fields();

-- 11.5 Trigger de proteção contra alteração de campos imutáveis em admin_profiles
CREATE OR REPLACE FUNCTION public.protect_admin_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.id IS DISTINCT FROM NEW.id THEN
        RAISE EXCEPTION 'O id do perfil administrativo é imutável.';
    END IF;

    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
        RAISE EXCEPTION 'O campo created_at é imutável.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_admin_profile_fields ON public.admin_profiles;
CREATE TRIGGER trg_protect_admin_profile_fields
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_admin_profile_fields();

-- 11.6 Trigger de atualização automática de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_updated_at_admin_profiles ON public.admin_profiles;
CREATE TRIGGER trg_set_updated_at_admin_profiles
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_conversations ON public.conversations;
CREATE TRIGGER trg_set_updated_at_conversations
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Revogar permissão de execução direta de todas as funções internas de triggers
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.normalize_new_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.normalize_visitor_conversation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_conversation_last_message_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_conversation_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_admin_profile_fields() FROM PUBLIC, anon, authenticated;

-- 12. HABILITAÇÃO IDEMPOTENTE DO SUPABASE REALTIME
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
