alter table players
  add column if not exists is_active boolean not null default true;

alter table bookings
  add column if not exists match_report jsonb;

alter table attendance
  add constraint attendance_booking_player_key unique (booking_id, player_id);

alter table ratings
  add column if not exists passing_accuracy numeric(4,2),
  alter column speed type numeric(4,2),
  alter column shooting type numeric(4,2),
  alter column dribbling type numeric(4,2),
  alter column ball_control type numeric(4,2),
  alter column stamina type numeric(4,2);

alter table ratings
  drop constraint if exists ratings_speed_check,
  drop constraint if exists ratings_shooting_check,
  drop constraint if exists ratings_dribbling_check,
  drop constraint if exists ratings_ball_control_check,
  drop constraint if exists ratings_stamina_check;

alter table ratings
  add constraint ratings_speed_check check (speed >= 0 and speed <= 10),
  add constraint ratings_shooting_check check (shooting >= 0 and shooting <= 10),
  add constraint ratings_passing_accuracy_check check (passing_accuracy >= 0 and passing_accuracy <= 10),
  add constraint ratings_dribbling_check check (dribbling >= 0 and dribbling <= 10),
  add constraint ratings_ball_control_check check (ball_control >= 0 and ball_control <= 10),
  add constraint ratings_stamina_check check (stamina >= 0 and stamina <= 10);

alter table user_roles
  drop constraint if exists user_roles_role_check,
  add constraint user_roles_role_check check (role in ('superuser', 'admin', 'budgeting_booking_officer', 'player'));

delete from user_roles
where player_id in (select id from players where name = 'Najib')
  and role <> 'superuser';

insert into user_roles (player_id, role)
select id, 'superuser'
from players
where name = 'Najib'
on conflict do nothing;

insert into user_roles (player_id, role)
select id, 'admin'
from players
where name = 'Nawfal'
on conflict do nothing;

drop policy if exists "admins manage roles" on user_roles;
drop policy if exists "players read own roles" on user_roles;
create policy "players read own roles" on user_roles for select using (
  exists (
    select 1 from players p
    where p.id = user_roles.player_id and p.auth_user_id = auth.uid()
  )
);

create policy "superusers manage roles" on user_roles for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role = 'superuser'
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role = 'superuser'
  )
);

drop policy if exists "players read finance transactions" on finance_transactions;
create policy "players read finance transactions" on finance_transactions for select using (auth.uid() is not null);

drop policy if exists "officers manage bookings" on bookings;
create policy "officers manage bookings" on bookings for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
);

drop policy if exists "officers manage finance transactions" on finance_transactions;
create policy "officers manage finance transactions" on finance_transactions for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
);
