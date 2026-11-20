-- V17: executar no Supabase SQL Editor com papel postgres. Preserva registros.
BEGIN;
-- GRANT de tabela é distinto de política RLS. O UPDATE falhava antes de avaliar a política.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bulletins TO authenticated;
-- A sequência de id bigint precisa ser utilizável para novos boletins.
DO $$ DECLARE seq_name text; BEGIN
  SELECT pg_get_serial_sequence('public.bulletins','id') INTO seq_name;
  IF seq_name IS NOT NULL THEN EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated',seq_name); END IF;
END $$;
ALTER TABLE public.bulletins ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bulletins' AND policyname='Staff edit bulletins') THEN
  CREATE POLICY "Staff edit bulletins" ON public.bulletins FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bulletins' AND policyname='Admins delete bulletins') THEN
  CREATE POLICY "Admins delete bulletins" ON public.bulletins FOR DELETE TO authenticated USING (public.is_admin());
 END IF;
END $$;
-- A auditoria já é SECURITY DEFINER na V16. Não dar INSERT direto ao cliente.
COMMIT;
