INSERT INTO public.medals (course, gold, silver, updated_at)
VALUES
    ('Gestão de Turismo', 0, 0, now()),
    ('Agroecologia', 0, 0, now())
ON CONFLICT (course) DO NOTHING;
