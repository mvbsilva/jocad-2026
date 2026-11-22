-- V25: nome completo no perfil, e-mail consultado exclusivamente via função de administrador.
-- Execute no SQL Editor do Supabase com privilégios de administrador do banco.
BEGIN;
ALTER TABLE public.staff_roles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.staff_roles DROP CONSTRAINT IF EXISTS staff_roles_full_name_length;
ALTER TABLE public.staff_roles ADD CONSTRAINT staff_roles_full_name_length CHECK (char_length(full_name) <= 160);

-- Sem acesso direto do navegador a auth.users.
CREATE OR REPLACE FUNCTION public.jocad_list_staff_v25()
RETURNS TABLE(user_id uuid, full_name text, email text, role text, active boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso não autorizado' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT s.user_id, s.full_name, u.email::text, s.role, s.active
  FROM public.staff_roles AS s LEFT JOIN auth.users AS u ON u.id = s.user_id
  ORDER BY s.active DESC, s.full_name NULLS LAST, u.email;
END;
$$;

-- O cadastro também valida a existência do UID no Authentication.
CREATE OR REPLACE FUNCTION public.jocad_save_staff_v25(p_user_id uuid, p_full_name text, p_role text, p_active boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE v_admin_count integer;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso não autorizado' USING ERRCODE = '42501';
  END IF;
  IF p_role NOT IN ('admin','staff') OR p_active IS NULL OR char_length(p_full_name)>160 THEN
    RAISE EXCEPTION 'Dados de perfil inválidos';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id=p_user_id) THEN
    RAISE EXCEPTION 'UID não encontrado em Authentication';
  END IF;
  IF p_user_id=auth.uid() AND (NOT p_active OR p_role<>'admin') THEN
    RAISE EXCEPTION 'Não é permitido remover o próprio acesso de administrador';
  END IF;
  SELECT count(*) INTO v_admin_count FROM public.staff_roles WHERE role='admin' AND active;
  IF EXISTS(SELECT 1 FROM public.staff_roles WHERE user_id=p_user_id AND role='admin' AND active)
     AND (NOT p_active OR p_role<>'admin') AND v_admin_count<=1 THEN
    RAISE EXCEPTION 'Não é permitido desativar o último administrador';
  END IF;
  INSERT INTO public.staff_roles AS s (user_id, full_name, role, active)
  VALUES (p_user_id, nullif(btrim(p_full_name),''), p_role, p_active)
  ON CONFLICT (user_id) DO UPDATE SET full_name=EXCLUDED.full_name, role=EXCLUDED.role, active=EXCLUDED.active;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.jocad_list_staff_v25() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.jocad_save_staff_v25(uuid,text,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.jocad_list_staff_v25() TO authenticated;
GRANT EXECUTE ON FUNCTION public.jocad_save_staff_v25(uuid,text,text,boolean) TO authenticated;
GRANT SELECT (full_name) ON public.staff_roles TO authenticated;
COMMIT;
