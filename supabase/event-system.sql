-- CampusLoop permanent event registration system
-- Run once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  institution text not null,
  venue text not null,
  event_date date not null,
  start_time time,
  end_time time,
  capacity integer check (capacity is null or capacity > 0),
  registration_open boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_admins (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'manager'
    check (role in ('owner', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  registration_code text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  institution text not null,
  course text not null,
  branch text not null,
  year_of_study text not null,
  roll_number text,
  consent boolean not null default false,
  registration_status text not null default 'registered'
    check (registration_status in ('registered', 'cancelled')),
  attendance_status text not null default 'pending'
    check (attendance_status in ('pending', 'present', 'absent')),
  certificate_status text not null default 'not_eligible'
    check (certificate_status in ('not_eligible', 'eligible', 'issued')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registration_attempts (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  fingerprint text not null,
  attempted_at timestamptz not null default now()
);

create unique index if not exists event_registration_email_unique
  on public.event_registrations (event_id, lower(email));

create unique index if not exists event_registration_phone_unique
  on public.event_registrations (
    event_id,
    regexp_replace(phone, '[^0-9]', '', 'g')
  );

create index if not exists event_registrations_event_created_idx
  on public.event_registrations (event_id, created_at desc);

create index if not exists event_registrations_branch_idx
  on public.event_registrations (event_id, branch);

create index if not exists registration_attempts_lookup_idx
  on public.registration_attempts (
    event_slug,
    fingerprint,
    attempted_at desc
  );

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists event_registrations_set_updated_at
on public.event_registrations;
create trigger event_registrations_set_updated_at
before update on public.event_registrations
for each row execute function public.set_updated_at();

insert into public.events (
  slug,
  title,
  description,
  institution,
  venue,
  event_date,
  start_time,
  capacity,
  registration_open,
  is_published
)
values (
  'extension-board-2026',
  'Extension Board Workshop 2026',
  'A supervised hands-on electrical workshop for students.',
  'Sandip University, Nashik',
  'Department of Electrical Engineering',
  date '2026-08-08',
  time '09:00',
  500,
  true,
  true
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  institution = excluded.institution,
  venue = excluded.venue,
  event_date = excluded.event_date,
  start_time = excluded.start_time,
  capacity = excluded.capacity,
  registration_open = excluded.registration_open,
  is_published = excluded.is_published,
  updated_at = now();

alter table public.events enable row level security;
alter table public.event_admins enable row level security;
alter table public.event_registrations enable row level security;
alter table public.registration_attempts enable row level security;

revoke all on table public.events from anon, authenticated;
revoke all on table public.event_admins from anon, authenticated;
revoke all on table public.event_registrations from anon, authenticated;
revoke all on table public.registration_attempts from anon, authenticated;

grant select on table public.events to anon, authenticated;
grant select on table public.event_admins to authenticated;
grant select on table public.event_registrations to authenticated;
grant update (
  attendance_status,
  certificate_status,
  updated_at
) on table public.event_registrations to authenticated;

grant all on table public.events to service_role;
grant all on table public.event_admins to service_role;
grant all on table public.event_registrations to service_role;
grant all on table public.registration_attempts to service_role;

drop policy if exists "Published events are publicly visible"
on public.events;
create policy "Published events are publicly visible"
on public.events
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can view their own event access"
on public.event_admins;
create policy "Admins can view their own event access"
on public.event_admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Event admins can view registrations"
on public.event_registrations;
create policy "Event admins can view registrations"
on public.event_registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.event_admins admin_access
    where admin_access.event_id = event_registrations.event_id
      and admin_access.user_id = auth.uid()
  )
);

drop policy if exists "Event managers can update registration workflow"
on public.event_registrations;
create policy "Event managers can update registration workflow"
on public.event_registrations
for update
to authenticated
using (
  exists (
    select 1
    from public.event_admins admin_access
    where admin_access.event_id = event_registrations.event_id
      and admin_access.user_id = auth.uid()
      and admin_access.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.event_admins admin_access
    where admin_access.event_id = event_registrations.event_id
      and admin_access.user_id = auth.uid()
      and admin_access.role in ('owner', 'manager')
  )
);

create or replace function public.register_event_submission(
  p_event_slug text,
  p_full_name text,
  p_email text,
  p_phone text,
  p_institution text,
  p_course text,
  p_branch text,
  p_year_of_study text,
  p_roll_number text,
  p_consent boolean,
  p_fingerprint text
)
returns table (
  registration_code text,
  event_title text,
  event_date date,
  venue text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_event public.events%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  v_code text;
  v_registration_count bigint;
begin
  if length(trim(coalesce(p_full_name, ''))) not between 2 and 100 then
    raise exception 'INVALID_FULL_NAME';
  end if;

  if v_email !~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
     or length(v_email) > 160 then
    raise exception 'INVALID_EMAIL';
  end if;

  if length(v_phone) not between 10 and 15 then
    raise exception 'INVALID_PHONE';
  end if;

  if length(trim(coalesce(p_institution, ''))) not between 2 and 160 then
    raise exception 'INVALID_INSTITUTION';
  end if;

  if length(trim(coalesce(p_course, ''))) not between 2 and 100 then
    raise exception 'INVALID_COURSE';
  end if;

  if length(trim(coalesce(p_branch, ''))) not between 2 and 100 then
    raise exception 'INVALID_BRANCH';
  end if;

  if p_year_of_study not in (
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year',
    'Other'
  ) then
    raise exception 'INVALID_YEAR';
  end if;

  if p_roll_number is not null
     and length(trim(p_roll_number)) > 40 then
    raise exception 'INVALID_ROLL_NUMBER';
  end if;

  if p_consent is not true then
    raise exception 'INVALID_CONSENT';
  end if;

  if length(coalesce(p_fingerprint, '')) <> 64 then
    raise exception 'INVALID_FINGERPRINT';
  end if;

  select *
  into v_event
  from public.events
  where slug = p_event_slug
    and is_published = true
  for update;

  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  if v_event.registration_open is not true
     or current_date > v_event.event_date then
    raise exception 'REGISTRATION_CLOSED';
  end if;

  if exists (
    select 1
    from public.event_registrations
    where event_id = v_event.id
      and lower(email) = v_email
  ) then
    raise exception 'DUPLICATE_EMAIL';
  end if;

  if exists (
    select 1
    from public.event_registrations
    where event_id = v_event.id
      and regexp_replace(phone, '[^0-9]', '', 'g') = v_phone
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  if v_event.capacity is not null then
    select count(*)
    into v_registration_count
    from public.event_registrations
    where event_id = v_event.id
      and registration_status = 'registered';

    if v_registration_count >= v_event.capacity then
      raise exception 'EVENT_FULL';
    end if;
  end if;

  loop
    v_code :=
      'EB26-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

    begin
      insert into public.event_registrations (
        event_id,
        registration_code,
        full_name,
        email,
        phone,
        institution,
        course,
        branch,
        year_of_study,
        roll_number,
        consent
      )
      values (
        v_event.id,
        v_code,
        trim(regexp_replace(p_full_name, '\s+', ' ', 'g')),
        v_email,
        v_phone,
        trim(regexp_replace(p_institution, '\s+', ' ', 'g')),
        trim(regexp_replace(p_course, '\s+', ' ', 'g')),
        trim(regexp_replace(p_branch, '\s+', ' ', 'g')),
        p_year_of_study,
        nullif(trim(coalesce(p_roll_number, '')), ''),
        true
      );

      exit;
    exception
      when unique_violation then
        if exists (
          select 1
          from public.event_registrations
          where event_id = v_event.id
            and lower(email) = v_email
        ) then
          raise exception 'DUPLICATE_EMAIL';
        end if;

        if exists (
          select 1
          from public.event_registrations
          where event_id = v_event.id
            and regexp_replace(phone, '[^0-9]', '', 'g') = v_phone
        ) then
          raise exception 'DUPLICATE_PHONE';
        end if;
        -- Random registration code collision: retry.
    end;
  end loop;

  return query
  select
    v_code,
    v_event.title,
    v_event.event_date,
    v_event.venue;
end;
$$;

revoke all on function public.register_event_submission(
  text, text, text, text, text, text, text, text, text, boolean, text
) from public, anon, authenticated;

grant execute on function public.register_event_submission(
  text, text, text, text, text, text, text, text, text, boolean, text
) to service_role;
