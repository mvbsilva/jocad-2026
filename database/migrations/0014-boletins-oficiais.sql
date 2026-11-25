BEGIN;
CREATE TABLE IF NOT EXISTS public.official_bulletins (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 200),
 file_path text NOT NULL UNIQUE CHECK (file_path ~ '^boletins/[^/]+[.]pdf$' AND file_path !~ '[[:cntrl:]]'),
 description text NOT NULL DEFAULT '', publication_date date NOT NULL,
 published boolean NOT NULL DEFAULT false, published_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 created_by uuid NOT NULL DEFAULT auth.uid()
);
ALTER TABLE public.official_bulletins ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.official_bulletins TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.official_bulletins TO authenticated;
CREATE POLICY official_read ON public.official_bulletins FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY official_staff_read ON public.official_bulletins FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY official_insert ON public.official_bulletins FOR INSERT TO authenticated WITH CHECK (public.is_staff() AND created_by = auth.uid());
CREATE POLICY official_update ON public.official_bulletins FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY official_delete ON public.official_bulletins FOR DELETE TO authenticated USING (public.is_staff());
CREATE FUNCTION public.official_bulletin_stamp() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 NEW.updated_at := now();
 IF TG_OP = 'UPDATE' THEN
 NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
 IF NEW.published AND OLD.published THEN NEW.published_at := OLD.published_at;
 ELSIF NEW.published THEN NEW.published_at := now(); ELSE NEW.published_at := NULL; END IF;
 ELSE NEW.published_at := CASE WHEN NEW.published THEN now() ELSE NULL END; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER official_stamp BEFORE INSERT OR UPDATE ON public.official_bulletins FOR EACH ROW EXECUTE FUNCTION public.official_bulletin_stamp();
CREATE TRIGGER official_audit AFTER INSERT OR UPDATE OR DELETE ON public.official_bulletins FOR EACH ROW EXECUTE FUNCTION public.record_change();
COMMIT;
