-- EXECUTAR MANUALMENTE NO SUPABASE SQL EDITOR, APOS BACKUP.
-- Substitua SUBSTITUA_PELA_CONFIRMACAO pelo token: CONFIRMO_ZERAR_TUDO
BEGIN;
DO $$ BEGIN
 IF 'SUBSTITUA_PELA_CONFIRMACAO' <> 'CONFIRMO_ZERAR_TUDO' THEN
  RAISE EXCEPTION 'Cancelado: confirme a operacao no arquivo SQL.';
 END IF;
END $$;
-- Mantem confrontos, equipes, categorias e datas.
UPDATE public.matches SET score_a=NULL, score_b=NULL,
 result_details='{}'::jsonb, winner_side=NULL,
 status='Programado', updated_at=now(), updated_by=NULL;
DELETE FROM public.bulletins;
UPDATE public.medals SET gold=0, silver=0, updated_at=now(), updated_by=NULL;
COMMIT;
