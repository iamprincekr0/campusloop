-- Replace the email below with the CampusLoop account that should
-- open /admin/events. The account must already exist in Supabase Auth.

do $$
declare
  v_user_id uuid;
  v_event_id uuid;
  v_admin_email text := lower('YOUR_LOGIN_EMAIL');
begin
  if v_admin_email = 'your_login_email' then
    raise exception 'Replace YOUR_LOGIN_EMAIL before running this query.';
  end if;

  select id
  into v_user_id
  from auth.users
  where lower(email) = v_admin_email
  limit 1;

  if v_user_id is null then
    raise exception 'No Supabase Auth user found for email: %', v_admin_email;
  end if;

  select id
  into v_event_id
  from public.events
  where slug = 'extension-board-2026';

  if v_event_id is null then
    raise exception 'Event extension-board-2026 not found.';
  end if;

  insert into public.event_admins (event_id, user_id, role)
  values (v_event_id, v_user_id, 'owner')
  on conflict (event_id, user_id)
  do update set role = excluded.role;
end;
$$;
