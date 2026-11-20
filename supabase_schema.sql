-- Execute no SQL Editor do Supabase uma única vez.
-- Crie os usuários no Authentication > Users; depois atribua papéis com o SQL do README.
create table if not exists public.staff_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check(role in ('admin','operador')),
 active boolean not null default true
);
create table if not exists public.matches (
 id text primary key, num integer not null unique, day integer not null check(day between 24 and 27),
 home text not null, away text not null, sport text not null, gender text not null,
 score_a integer check(score_a >= 0), score_b integer check(score_b >= 0),
 status text not null default 'Programado' check(status in ('Programado','Em andamento','Finalizado')),
 updated_at timestamptz not null default now(), updated_by uuid references auth.users(id),
 constraint both_scores check ((score_a is null) = (score_b is null)),
 constraint completed_scores check(status <> 'Finalizado' or score_a is not null)
);
create table if not exists public.bulletins (
 id bigint generated always as identity primary key,
 title text not null check(length(title) between 1 and 160),
 body text not null check(length(body) between 1 and 6000),
 published_at timestamptz not null default now(), author_id uuid references auth.users(id)
);
create table if not exists public.medals (
 course text primary key, gold integer not null default 0 check(gold>=0),
 silver integer not null default 0 check(silver>=0),
 updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);
create table if not exists public.audit_log (
 id bigint generated always as identity primary key,
 actor uuid references auth.users(id), entity text not null,
 record_key text not null, old_data jsonb, new_data jsonb,
 changed_at timestamptz not null default now()
);
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.staff_roles where user_id=(select auth.uid()) and active)
$$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.staff_roles where user_id=(select auth.uid()) and active and role='admin')
$$;
revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
create or replace function public.record_change() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if tg_op='DELETE' then
  insert into public.audit_log(actor,entity,record_key,old_data,new_data) values(auth.uid(),tg_table_name,case when tg_table_name='matches' then old.id when tg_table_name='medals' then old.course else old.id::text end,to_jsonb(old),null);
  return old;
 end if;
 if tg_table_name='matches' then
  new.updated_at=now();new.updated_by=auth.uid();
 elsif tg_table_name='medals' then
  new.updated_at=now();new.updated_by=auth.uid();
 end if;
 insert into public.audit_log(actor,entity,record_key,old_data,new_data)
 values(auth.uid(),tg_table_name,case when tg_table_name='matches' then new.id when tg_table_name='medals' then new.course else new.id::text end,
 case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
 return new;
end $$;
drop trigger if exists audit_matches on public.matches;
create trigger audit_matches before update on public.matches for each row execute function public.record_change();
drop trigger if exists audit_medals on public.medals;
create trigger audit_medals before update on public.medals for each row execute function public.record_change();
drop trigger if exists audit_bulletins on public.bulletins;
create trigger audit_bulletins before insert on public.bulletins for each row execute function public.record_change();
alter table public.staff_roles enable row level security;
alter table public.matches enable row level security;
alter table public.bulletins enable row level security;
alter table public.medals enable row level security;
alter table public.audit_log enable row level security;
create policy "Staff can see own role" on public.staff_roles for select to authenticated using (user_id=(select auth.uid()) or public.is_admin());
create policy "Admins manage staff" on public.staff_roles for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Public matches" on public.matches for select to anon,authenticated using(true);
create policy "Staff edit matches" on public.matches for update to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "Public bulletins" on public.bulletins for select to anon,authenticated using(true);
create policy "Staff post bulletins" on public.bulletins for insert to authenticated with check(public.is_staff() and author_id=(select auth.uid()));
create policy "Public medals" on public.medals for select to anon,authenticated using(true);
create policy "Staff update medals" on public.medals for update to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "Staff audit read" on public.audit_log for select to authenticated using(public.is_staff());
revoke all on public.audit_log from anon,authenticated;
grant select on public.audit_log to authenticated;
grant select on public.staff_roles to authenticated;
grant select,update on public.matches to authenticated;
grant select on public.matches to anon;
grant select,insert on public.bulletins to authenticated;
grant select on public.bulletins to anon;
grant select,update on public.medals to authenticated;
grant select on public.medals to anon;
insert into public.matches(id,num,day,home,away,sport,gender) values
('24-01',1,24,'Tijo Grils','As Pérolas Da Ledoc','Queimada','Feminino'),
('24-02',2,24,'Águias','Ecofúria','Queimada','Feminino'),
('24-03',3,24,'Los Pedreiros','Info26','Queimada','Masculino'),
('24-04',4,24,'Amigos Do Euclides','Tijolada B','Queimada','Masculino'),
('24-05',5,24,'Fúria Verde','Pesca 26','Queimada','Masculino'),
('24-06',6,24,'Tijolada','Clone Los Pedreiros','Queimada','Masculino'),
('24-07',7,24,'Os Andirobas','Informática','Vôlei','Masculino'),
('24-08',8,24,'Equipe 22','Amigos do Marajá','Futsal sub 18','Masculino'),
('24-09',9,24,'Fut Física F.C','Servidores','Futsal adulto','Masculino'),
('24-10',10,24,'Geografia','Atlantis Fc','Futsal adulto','Masculino'),
('25-11',11,25,'Los Pedreiros','Tijolada','Queimada','Feminino'),
('25-12',12,25,'As Panteras Da Ledoc','Tsunami','Queimada','Feminino'),
('25-13',13,25,'Amigos do Euclides','Venc. Jg. 01','Queimada','Feminino'),
('25-14',14,25,'Aquicultura 26','Venc. Jg. 02','Queimada','Feminino'),
('25-15',15,25,'RealMatismo','Meio Ambiente 26','Vôlei','Feminino'),
('25-16',16,25,'Tijolada','As Cocotas','Vôlei','Feminino'),
('25-17',17,25,'Tijoladas','Os Caras do Mato','Vôlei','Masculino'),
('25-18',18,25,'Ecoferas','Salto 15','Futsal','Feminino'),
('25-19',19,25,'Real Info','Los Pedreiros','Futsal sub-18','Masculino'),
('25-20',20,25,'Velha Guarda e Nova Safra','Venc. Jg 09','Futsal adulto','Masculino'),
('26-21',21,26,'Venc. Jg. 11','Venc. Jg. 12','Queimada','Feminino'),
('26-22',22,26,'Venc. Jg. 13','Venc. Jg. 14','Queimada','Feminino'),
('26-23',23,26,'Venc. Jg. 03','Venc. Jg. 04','Queimada','Masculino'),
('26-24',24,26,'Venc. Jg. 05','Venc. Jg. 06','Queimada','Masculino'),
('26-25',25,26,'Venc. Jg. 21','Venc. Jg. 22','Queimada','Feminino'),
('26-26',26,26,'Venc. Jg. 23','Venc. Jg. 24','Queimada','Masculino'),
('26-27',27,26,'Náuticos Voleibol','Venc. Jg. 07','Vôlei','Masculino'),
('26-28',28,26,'Aquiboll','Informática','Basquete','Masculino'),
('26-29',29,26,'Alta Cúpula','Venc. Jg. 08','Futsal sub-18','Masculino'),
('26-30',30,26,'Jocad 2026','Venc. Jg. 10','Futsal adulto','Masculino'),
('27-31',31,27,'Bola no Buraco','Venc. Jg. 28','Basquete','Masculino'),
('27-32',32,27,'Venc. Jg. 15','Venc. Jg. 16','Vôlei','Feminino'),
('27-33',33,27,'Venc. Jg. 17','Venc. Jg. 27','Vôlei','Masculino'),
('27-34',34,27,'Realmatismo Fc','Venc. Jg. 18','Futsal','Feminino'),
('27-35',35,27,'Venc. Jg. 19','Venc. Jg. 29','Futsal sub-18','Masculino'),
('27-36',36,27,'Venc. Jg. 20','Venc. Jg. 30','Futsal adulto','Masculino')
on conflict(id) do nothing;
insert into public.medals(course) values
('Aquicultura'),('Biologia'),('Edificações'),('Física'),('Geografia'),('Informática'),('Meio Ambiente'),('Pesca'),('Servidores')
on conflict(course) do nothing;
