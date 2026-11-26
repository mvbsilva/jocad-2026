-- V48: executar uma única vez, com a Secretaria fechada e backup realizado.
BEGIN;
SET LOCAL lock_timeout = '5s';
LOCK TABLE public.matches IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.medal_awards IN SHARE ROW EXCLUSIVE MODE;
DO $$
BEGIN
 IF (SELECT count(*) FROM public.matches) <> 36 OR
    (SELECT count(*) FROM public.matches WHERE id IN ('26-29','26-30','27-31','27-32','27-33','27-34','27-35','27-36') AND status='Programado' AND score_a IS NULL AND score_b IS NULL AND winner_side IS NULL AND finished_at IS NULL AND result_details='{}'::jsonb) <> 8 THEN
  RAISE EXCEPTION 'Programação original divergente ou jogo com resultado: nenhuma alteração aplicada.';
 END IF;
 IF EXISTS (SELECT 1 FROM public.medal_awards WHERE match_id IN ('26-29','26-30','27-31','27-32','27-33','27-34','27-35','27-36')) THEN
  RAISE EXCEPTION 'Existem conquistas vinculadas aos jogos alterados: revisão necessária.';
 END IF;
END $$;
-- O antigo jogo 30 foi retirado por WO; Atlantis avança conforme tabela oficial.
UPDATE public.matches SET id='27-30', day=27 WHERE id='26-30';
UPDATE public.matches m SET num=v.num, day=v.day, home=v.home, away=v.away, sport=v.sport, gender=v.gender
FROM (VALUES
('26-29',29,26,'Bola no Buraco','Edificações','Basquete','Masculino'),
('27-30',30,27,'Venc. Jg. 28','Venc. Jg. 29','Basquete','Masculino'),
('27-31',31,27,'Venc. Jg. 15','Venc. Jg. 16','Vôlei','Feminino'),
('27-32',32,27,'Venc. Jg. 17','Venc. Jg. 27','Vôlei','Masculino'),
('27-33',33,27,'Alta Cúpula','Venc. Jg. 08','Futsal sub-18','Masculino'),
('27-34',34,27,'Realmatismo Fc','Venc. Jg. 18','Futsal','Feminino'),
('27-35',35,27,'Venc. Jg. 20','Atlantis Fc','Futsal adulto','Masculino'),
('27-36',36,27,'Venc. Jg. 19','Venc. Jg. 33','Futsal sub-18','Masculino')
) AS v(id,num,day,home,away,sport,gender)
WHERE m.id=v.id;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.matches) <> 36 OR (SELECT count(DISTINCT num) FROM public.matches) <> 36 THEN
 RAISE EXCEPTION 'Contagem de jogos inválida'; END IF;
END $$;
COMMIT;
SELECT id,num,day,home,away,sport,gender,status FROM public.matches WHERE num>=21 ORDER BY num;
