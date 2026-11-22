-- Executar no SQL Editor do Supabase com privilégios de administração.
-- Preserva todas as medalhas e registros existentes.
INSERT INTO public.medals (course, gold, silver, updated_at)
VALUES ('Educação do Campo', 0, 0, now())
ON CONFLICT (course) DO NOTHING;
