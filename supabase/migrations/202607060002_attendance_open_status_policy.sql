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
      and (
        b.reservation_status = 'open'
        or booking_attendance_is_open(b.starts_at, b.duration_minutes)
      )
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
      and (
        b.reservation_status = 'open'
        or booking_attendance_is_open(b.starts_at, b.duration_minutes)
      )
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
      and (
        b.reservation_status = 'open'
        or booking_attendance_is_open(b.starts_at, b.duration_minutes)
      )
  )
);
