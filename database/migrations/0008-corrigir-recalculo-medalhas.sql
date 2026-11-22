-- V29: corrige recálculo das medalhas sem UPDATE global.
-- Executar após 0007; preserva premiações, usuários e histórico.
BEGIN;
CREATE OR REPLACE FUNCTION public.jocad_recount_medals_v28() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_course text;
BEGIN
  v_course := CASE WHEN TG_OP = 'DELETE' THEN OLD.course ELSE NEW.course END;
  UPDATE public.medals AS m
     SET gold = (SELECT count(*)::integer FROM public.medal_awards a
                  WHERE a.course = v_course AND a.status = 'confirmed' AND a.medal_type = 'gold'),
         silver = (SELECT count(*)::integer FROM public.medal_awards a
                    WHERE a.course = v_course AND a.status = 'confirmed' AND a.medal_type = 'silver'),
         updated_at = now(), updated_by = auth.uid()
   WHERE m.course = v_course;
  IF TG_OP = 'UPDATE' AND OLD.course IS DISTINCT FROM NEW.course THEN
    UPDATE public.medals AS m
       SET gold = (SELECT count(*)::integer FROM public.medal_awards a
                    WHERE a.course = OLD.course AND a.status = 'confirmed' AND a.medal_type = 'gold'),
           silver = (SELECT count(*)::integer FROM public.medal_awards a
                      WHERE a.course = OLD.course AND a.status = 'confirmed' AND a.medal_type = 'silver'),
           updated_at = now(), updated_by = auth.uid()
     WHERE m.course = OLD.course;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS medal_awards_recount ON public.medal_awards;
CREATE TRIGGER medal_awards_recount
AFTER INSERT OR UPDATE OR DELETE ON public.medal_awards
FOR EACH ROW EXECUTE FUNCTION public.jocad_recount_medals_v28();
COMMIT;
