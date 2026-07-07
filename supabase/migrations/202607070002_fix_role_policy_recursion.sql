create or replace function public.korasmart_has_role(required_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid()
      and ur.role = any(required_roles)
  );
$$;

grant execute on function public.korasmart_has_role(text[]) to authenticated;

drop policy if exists "admins manage players" on public.players;
create policy "admins manage players" on public.players for all using (
  public.korasmart_has_role(array['superuser', 'admin'])
) with check (
  public.korasmart_has_role(array['superuser', 'admin'])
);

drop policy if exists "superusers manage roles" on public.user_roles;
create policy "superusers manage roles" on public.user_roles for all using (
  public.korasmart_has_role(array['superuser'])
) with check (
  public.korasmart_has_role(array['superuser'])
);

drop policy if exists "officers manage bookings" on public.bookings;
create policy "officers manage bookings" on public.bookings for all using (
  public.korasmart_has_role(array['superuser', 'admin', 'budgeting_booking_officer'])
) with check (
  public.korasmart_has_role(array['superuser', 'admin', 'budgeting_booking_officer'])
);

drop policy if exists "players insert own attendance when open" on public.attendance;
create policy "players insert own attendance when open" on public.attendance for insert with check (
  (
    exists (
      select 1
      from public.players p
      where p.id = attendance.player_id
        and p.auth_user_id = auth.uid()
    )
    or public.korasmart_has_role(array['superuser'])
  )
  and exists (
    select 1
    from public.bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or public.booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

drop policy if exists "players update own attendance when open" on public.attendance;
create policy "players update own attendance when open" on public.attendance for update using (
  exists (
    select 1
    from public.players p
    where p.id = attendance.player_id
      and p.auth_user_id = auth.uid()
  )
  or public.korasmart_has_role(array['superuser'])
) with check (
  (
    exists (
      select 1
      from public.players p
      where p.id = attendance.player_id
        and p.auth_user_id = auth.uid()
    )
    or public.korasmart_has_role(array['superuser'])
  )
  and exists (
    select 1
    from public.bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or public.booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

drop policy if exists "players delete own attendance when open" on public.attendance;
create policy "players delete own attendance when open" on public.attendance for delete using (
  (
    exists (
      select 1
      from public.players p
      where p.id = attendance.player_id
        and p.auth_user_id = auth.uid()
    )
    or public.korasmart_has_role(array['superuser'])
  )
  and exists (
    select 1
    from public.bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or public.booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

drop policy if exists "officers manage finance transactions" on public.finance_transactions;
create policy "officers manage finance transactions" on public.finance_transactions for all using (
  public.korasmart_has_role(array['superuser', 'admin', 'budgeting_booking_officer'])
) with check (
  public.korasmart_has_role(array['superuser', 'admin', 'budgeting_booking_officer'])
);
