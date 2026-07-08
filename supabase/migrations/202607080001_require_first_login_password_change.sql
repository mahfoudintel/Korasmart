-- Force linked KoraSmart accounts that are still using the default password
-- to choose a private password on next login. The app clears this flag after
-- the player saves a new password.
create extension if not exists "pgcrypto";

update public.players p
set must_change_password = true
from auth.users u
where p.auth_user_id = u.id
  and p.username is not null
  and u.encrypted_password = crypt('kora2026', u.encrypted_password);
