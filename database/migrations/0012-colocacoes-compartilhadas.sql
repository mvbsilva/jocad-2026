-- V41: consolida a correção já aplicada em produção; reexecutável.
BEGIN;
DROP INDEX IF EXISTS public.medal_awards_one_per_placement;
CREATE UNIQUE INDEX medal_awards_one_per_placement ON public.medal_awards(category,lower(btrim(activity)),gender,placement) WHERE status='confirmed' AND category <> 'legacy' AND placement IN (1,2);
DROP INDEX IF EXISTS public.medal_awards_one_per_prize;
CREATE UNIQUE INDEX medal_awards_one_per_prize ON public.medal_awards(category,lower(btrim(activity)),gender,medal_type) WHERE status='confirmed' AND category <> 'legacy' AND placement IN (1,2);
COMMIT;
