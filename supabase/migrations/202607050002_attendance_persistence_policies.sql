alter table attendance
  add column if not exists booking_id uuid references bookings(id) on delete cascade;

create or replace function reservation_open_at(starts_at timestamptz)
returns timestamptz
language sql
stable
as $$
  select ((date_trunc('day', starts_at at time zone 'Africa/Casablanca') - interval '1 day') + time '11:00') at time zone 'Africa/Casablanca';
$$;

create or replace function booking_attendance_is_open(booking_starts_at timestamptz, booking_duration_minutes int)
returns boolean
language sql
stable
as $$
  select now() >= reservation_open_at(booking_starts_at)
    and now() < booking_starts_at + make_interval(mins => booking_duration_minutes);
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'attendance_booking_player_key'
      and conrelid = 'attendance'::regclass
  ) then
    alter table attendance
      add constraint attendance_booking_player_key unique (booking_id, player_id);
  end if;
end $$;

alter table attendance enable row level security;

drop policy if exists "members read attendance" on attendance;
drop policy if exists "players read attendance" on attendance;
create policy "members read attendance" on attendance for select using (
  auth.uid() is not null
);

drop policy if exists "players update attendance only when open" on attendance;
drop policy if exists "players insert own attendance when open" on attendance;
drop policy if exists "players update own attendance when open" on attendance;
drop policy if exists "players delete own attendance when open" on attendance;

create policy "players insert own attendance when open" on attendance for insert with check (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
  )
);

create policy "players update own attendance when open" on attendance for update using (
  exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid()
      and ur.role = 'superuser'
  )
) with check (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
  )
);

create policy "players delete own attendance when open" on attendance for delete using (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
  )
);
