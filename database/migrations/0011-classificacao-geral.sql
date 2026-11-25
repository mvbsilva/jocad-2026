-- V40: executar somente após 0010, antes de publicar o frontend.
BEGIN;
ALTER TABLE public.medal_awards ADD COLUMN placement integer;
ALTER TABLE public.medal_awards ALTER COLUMN medal_type DROP NOT NULL;
ALTER TABLE public.medal_awards DROP CONSTRAINT medal_awards_category_check;
ALTER TABLE public.medal_awards ADD CONSTRAINT medal_awards_category_check CHECK(category IN ('sport','culture','art','legacy'));
UPDATE public.medal_awards SET placement=CASE medal_type WHEN 'gold' THEN 1 WHEN 'silver' THEN 2 END WHERE placement IS NULL;
ALTER TABLE public.medal_awards ALTER COLUMN placement SET NOT NULL;
ALTER TABLE public.medal_awards ADD CONSTRAINT medal_awards_placement_check CHECK(placement BETWEEN 1 AND 5);
ALTER TABLE public.medal_awards ADD CONSTRAINT medal_awards_medal_placement_check CHECK(medal_type IS NULL OR (medal_type='gold' AND placement=1) OR (medal_type='silver' AND placement=2));
CREATE UNIQUE INDEX medal_awards_one_per_placement ON public.medal_awards(category,lower(btrim(activity)),gender,placement) WHERE status='confirmed' AND category <> 'legacy';
CREATE FUNCTION public.jocad_placement_compat_v40() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF NEW.placement IS NULL THEN NEW.placement := CASE NEW.medal_type WHEN 'gold' THEN 1 WHEN 'silver' THEN 2 END; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER medal_awards_00_placement BEFORE INSERT ON public.medal_awards FOR EACH ROW EXECUTE FUNCTION public.jocad_placement_compat_v40();
COMMIT;
