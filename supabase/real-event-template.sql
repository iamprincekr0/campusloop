-- CampusLoop: real-data-only single event template
-- Run once in Supabase SQL Editor.

alter table public.events alter column institution drop not null;
alter table public.events alter column venue drop not null;
alter table public.events alter column event_date drop not null;

alter table public.events
  add column if not exists department text,
  add column if not exists coordinator text,
  add column if not exists registration_deadline timestamptz;

-- Remove seeded/demo values. Admin must enter the real values.
update public.events
set
  description = null,
  institution = null,
  venue = null,
  event_date = null,
  start_time = null,
  end_time = null,
  capacity = null,
  department = null,
  coordinator = null,
  registration_deadline = null,
  registration_open = false,
  updated_at = now()
where slug = 'extension-board-2026';

-- Allow approved event admins to update the single event record.
grant update (
  title,
  description,
  institution,
  venue,
  event_date,
  start_time,
  end_time,
  capacity,
  registration_open,
  department,
  coordinator,
  registration_deadline,
  updated_at
) on table public.events to authenticated;

drop policy if exists "Event managers can update event settings" on public.events;
create policy "Event managers can update event settings"
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.event_admins ea
    where ea.event_id = events.id
      and ea.user_id = auth.uid()
      and ea.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.event_admins ea
    where ea.event_id = events.id
      and ea.user_id = auth.uid()
      and ea.role in ('owner', 'manager')
  )
);
