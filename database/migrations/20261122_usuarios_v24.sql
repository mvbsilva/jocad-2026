-- V24: acesso administrativo ao cadastro de perfis. Execute no SQL Editor.
-- A RLS continua restringindo todas as mutações a public.is_admin().
BEGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.staff_roles TO authenticated;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='staff_roles' AND policyname='Admins manage staff') THEN
    CREATE POLICY "Admins manage staff" ON public.staff_roles FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='staff_roles' AND policyname='Staff can see own role') THEN
    CREATE POLICY "Staff can see own role" ON public.staff_roles FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()) OR public.is_admin());
  END IF;
END $$;
COMMIT;
