-- V37: somente metadados de finalização. Executar após backup, no SQL Editor.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS finished_at timestamptz;
DROP TRIGGER IF EXISTS jocad_track_finished_at ON public.matches;
-- Recupera a última transição para Finalizado, somente para jogos ainda finalizados.
-- Não inventa horários para registros sem histórico; não sobrescreve horários existentes.
WITH history AS (
 SELECT record_key, max(changed_at) AS finished_at
 FROM public.audit_log
 WHERE entity = 'matches' AND old_data IS NOT NULL
   AND old_data->>'status' IS DISTINCT FROM 'Finalizado'
   AND new_data->>'status' = 'Finalizado'
 GROUP BY record_key
)
UPDATE public.matches m SET finished_at = h.finished_at
FROM history h WHERE m.id::text = h.record_key
 AND m.status = 'Finalizado' AND m.finished_at IS NULL;
CREATE OR REPLACE FUNCTION public.jocad_track_finished_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NEW.status IS DISTINCT FROM 'Finalizado' THEN
  NEW.finished_at := NULL;
 ELSIF TG_OP = 'INSERT' THEN
  NEW.finished_at := clock_timestamp();
 ELSIF OLD.status IS DISTINCT FROM 'Finalizado' THEN
  NEW.finished_at := clock_timestamp();
 ELSE
  NEW.finished_at := OLD.finished_at;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER jocad_track_finished_at BEFORE INSERT OR UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.jocad_track_finished_at();
COMMIT;
-- Validação (somente leitura):
SELECT id, num, home, away, status, finished_at FROM public.matches
WHERE status = 'Finalizado' ORDER BY finished_at DESC NULLS LAST, id;
