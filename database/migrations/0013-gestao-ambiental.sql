INSERT INTO public.medals (course, gold, silver, updated_at)
VALUES ('Gestão Ambiental', 0, 0, now())
ON CONFLICT (course) DO NOTHING;
