-- JOCAD 2026 V13 — execute no SQL Editor, depois do esquema original.
-- Preserva confrontos, resultados existentes, usuários e medalhas.
alter table public.matches add column if not exists result_details jsonb not null default '{}'::jsonb;
alter table public.matches add column if not exists winner_side text;
alter table public.matches drop constraint if exists matches_winner_side_check;
alter table public.matches add constraint matches_winner_side_check check (winner_side in ('A','B') or winner_side is null);
-- Corrige status 'Adiado' já oferecido pela interface.
alter table public.matches drop constraint if exists matches_status_check;
alter table public.matches add constraint matches_status_check check (status in ('Programado','Em andamento','Finalizado','Adiado'));
-- RLS existente de UPDATE continua valendo; nenhuma chave privilegiada é necessária.
-- Realtime deve ser habilitado na tabela matches caso se deseje atualização imediata.
