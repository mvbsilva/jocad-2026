-- V16: auditoria sem liberar INSERT direto em audit_log para usuários comuns.
-- Execute no SQL Editor com privilégios de administrador (normalmente postgres).
BEGIN;
CREATE OR REPLACE FUNCTION public.record_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_new jsonb; v_old jsonb; v_key text;
BEGIN
  IF TG_OP = 'DELETE' THEN v_new := NULL; v_old := to_jsonb(OLD);
  ELSIF TG_OP = 'INSERT' THEN v_new := to_jsonb(NEW); v_old := NULL;
  ELSE v_new := to_jsonb(NEW); v_old := to_jsonb(OLD); END IF;
  v_key := CASE TG_TABLE_NAME
    WHEN 'matches' THEN COALESCE(v_new->>'id',v_old->>'id')
    WHEN 'medals' THEN COALESCE(v_new->>'course',v_old->>'course')
    WHEN 'bulletins' THEN COALESCE(v_new->>'id',v_old->>'id')
    ELSE COALESCE(v_new->>'id',v_old->>'id','unknown') END;
  INSERT INTO public.audit_log(actor,entity,record_key,old_data,new_data,changed_at)
  VALUES (auth.uid(),TG_TABLE_NAME,v_key,v_old,v_new,now());
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END; $$;
-- Evita invocação direta de função de trigger por papéis comuns.
REVOKE ALL ON FUNCTION public.record_change() FROM PUBLIC, anon, authenticated;
-- UPDATE/DELETE autorizados via RLS; cria políticas somente se ausentes.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bulletins' AND policyname='Staff edit bulletins') THEN
  CREATE POLICY "Staff edit bulletins" ON public.bulletins FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bulletins' AND policyname='Admins delete bulletins') THEN
  CREATE POLICY "Admins delete bulletins" ON public.bulletins FOR DELETE TO authenticated USING (public.is_admin());
 END IF;
END $$;
-- Registra também alterações e exclusões de boletins.
DROP TRIGGER IF EXISTS audit_bulletins_update ON public.bulletins;
CREATE TRIGGER audit_bulletins_update BEFORE UPDATE OR DELETE ON public.bulletins FOR EACH ROW EXECUTE FUNCTION public.record_change();
COMMIT;
-- Se houver erro 'permission denied' após aplicar, verifique o OWNER da função:
-- SELECT p.proname, pg_get_userbyid(p.proowner) FROM pg_proc p WHERE p.oid='public.record_change()'::regprocedure;
