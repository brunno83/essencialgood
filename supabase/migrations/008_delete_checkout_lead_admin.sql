-- ============================================================================
-- ESSENCIAL GOOD - MIGRATION 008: DELETE CHECKOUT LEAD ADMIN RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_checkout_lead_admin(
  p_lead_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted_id UUID;
BEGIN
  -- 1. SEGURANÇA CRÍTICA: Apenas autenticados com perfil estrito de admin (agents e anon são bloqueados)
  IF auth.role() <> 'authenticated' OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  -- 2. VALIDAÇÃO ESTRITA DO PARÂMETRO
  IF p_lead_id IS NULL THEN
    RAISE EXCEPTION 'ID do lead é obrigatório.';
  END IF;

  -- 3. EXCLUSÃO INDIVIDUAL EXCLUSIVAMENTE PELO UUID DO LEAD
  DELETE FROM public.checkout_leads
  WHERE id = p_lead_id
  RETURNING id INTO v_deleted_id;

  -- 4. RETORNO CONTROLADO EM CASO DE NÃO ENCONTRADO OU SUCESSO
  IF v_deleted_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Lead não encontrado.'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_id', v_deleted_id
  );
END;
$$;

-- 5. PERMISSÕES ESTRITAS (APENAS AUTHENTICATED COM EXECUTE, REVOGADO DE PUBLIC E ANON)
REVOKE ALL ON FUNCTION public.delete_checkout_lead_admin(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_checkout_lead_admin(UUID) TO authenticated;
