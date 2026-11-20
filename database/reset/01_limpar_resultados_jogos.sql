-- EXECUTAR MANUALMENTE NO SUPABASE SQL EDITOR, APOS BACKUP.
-- Substitua SUBSTITUA_PELA_CONFIRMACAO pelo token: CONFIRMO_LIMPAR_JOGOS
BEGIN;
DO $$ BEGIN
 IF 'SUBSTITUA_PELA_CONFIRMACAO' <> 'CONFIRMO_LIMPAR_JOGOS' THEN
  RAISE EXCEPTION 'Cancelado: confirme a operacao no arquivo SQL.';
 END IF;
END $$;
-- Mantem confrontos, equipes, categorias e datas.
UPDATE public.matches SET score_a=NULL, score_b=NULL,
 result_details='{}'::jsonb, winner_side=NULL,
 status='Programado', updated_at=now(), updated_by=NULL;
COMMIT;
