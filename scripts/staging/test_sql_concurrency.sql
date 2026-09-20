-- Teste Paralelo Concorrente de SQL (consume_rate_limit)
-- Dispara 20 worker threads via PL/pgSQL assíncrono / concorrência nativa no banco

DO $$
DECLARE
  v_bucket_base VARCHAR := 'test_conc_sql_' || floor(random() * 1000000)::text;
  v_results JSONB;
BEGIN
  -- Teste 1: Cota 5, 20 disparos
  PERFORM public.consume_rate_limit(v_bucket_base || '_1', 'test_scope', 5, 300);
END $$;
