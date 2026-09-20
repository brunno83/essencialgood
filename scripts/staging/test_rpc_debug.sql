DO $$
DECLARE
  v_user_id UUID;
  v_conv_id UUID;
  v_res JSONB;
BEGIN
  -- Insert dummy auth.users record for testing
  v_user_id := gen_random_uuid();
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@test.com', 'pwd', now(), now(), now());

  v_res := public.p_create_visitor_conversation(v_user_id);
  v_conv_id := (v_res->>'conversation_id')::UUID;
  RAISE NOTICE 'Conversation Result: %', v_res;

  v_res := public.p_send_visitor_message(v_user_id, v_conv_id, 'Test content');
  RAISE NOTICE 'Message Result: %', v_res;

  RAISE EXCEPTION 'ROLLBACK' USING ERRCODE = 'P0001';
END $$;
