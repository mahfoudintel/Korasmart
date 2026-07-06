with account_map(player_name, username, email) as (
  values
    ('Najib', 'najib', 'najib@korasmart.local'),
    ('Ahmed A', 'ahmed.a', 'ahmed.a@korasmart.local'),
    ('Ahmed G', 'ahmed.g', 'ahmed.g@korasmart.local'),
    ('Nawfal', 'nawfal', 'nawfal@korasmart.local'),
    ('Badr', 'badr', 'badr@korasmart.local'),
    ('Said', 'said', 'said@korasmart.local'),
    ('Driss', 'driss', 'driss@korasmart.local'),
    ('Abdou', 'abdou', 'abdou@korasmart.local'),
    ('Bobker', 'bobker', 'bobker@korasmart.local'),
    ('Abdelhamid', 'abdelhamid', 'abdelhamid@korasmart.local'),
    ('Ismail', 'ismail', 'ismail@korasmart.local'),
    ('Mehdi', 'mehdi', 'mehdi@korasmart.local'),
    ('Elhachmi', 'elhachmi', 'elhachmi@korasmart.local'),
    ('Miloudi', 'miloudi', 'miloudi@korasmart.local'),
    ('Yassine', 'yassine', 'yassine@korasmart.local'),
    ('Hicham', 'hicham', 'hicham@korasmart.local')
)
update public.players p
set
  auth_user_id = u.id,
  username = account_map.username,
  must_change_password = false,
  is_active = true
from account_map
join auth.users u on lower(u.email) = lower(account_map.email)
where lower(p.name) = lower(account_map.player_name);

with najib as (
  select id from public.players where lower(name) = 'najib' limit 1
)
delete from public.user_roles
where player_id in (select id from najib)
  and role <> 'superuser';

insert into public.user_roles (player_id, role)
select id, 'superuser'
from public.players
where lower(name) = 'najib'
  and not exists (
    select 1
    from public.user_roles ur
    where ur.player_id = players.id
      and ur.role = 'superuser'
  );

insert into public.user_roles (player_id, role)
select id, 'admin'
from public.players
where lower(name) = 'nawfal'
  and not exists (
    select 1
    from public.user_roles ur
    where ur.player_id = players.id
      and ur.role = 'admin'
  );

insert into public.user_roles (player_id, role)
select id, 'player'
from public.players
where lower(name) not in ('najib', 'nawfal')
  and not exists (
    select 1
    from public.user_roles ur
    where ur.player_id = players.id
  );

select
  p.name,
  p.username,
  u.email,
  case when p.auth_user_id = u.id then 'linked' else 'not linked' end as auth_status
from public.players p
left join auth.users u on u.id = p.auth_user_id
where p.username in (
  'najib',
  'ahmed.a',
  'ahmed.g',
  'nawfal',
  'badr',
  'said',
  'driss',
  'abdou',
  'bobker',
  'abdelhamid',
  'ismail',
  'mehdi',
  'elhachmi',
  'miloudi',
  'yassine',
  'hicham'
)
order by p.name;
