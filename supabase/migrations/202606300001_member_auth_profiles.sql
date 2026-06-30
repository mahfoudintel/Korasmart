alter table players
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists username text,
  add column if not exists must_change_password boolean not null default false;

create unique index if not exists players_auth_user_id_key
  on players(auth_user_id)
  where auth_user_id is not null;

create unique index if not exists players_username_key
  on players(username)
  where username is not null;

update players
set username = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '.', 'g'))
where username is null;

insert into user_roles (player_id, role)
select id, 'admin'
from players
where name in ('Najib', 'Nawfal')
on conflict do nothing;
