-- LuFa — initial schema
-- Two seeded users: Fabian and Luca (email magic-link only)

create table if not exists activities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text check (category in ('date_night','trip','restaurant','hike','event','routine','other')),
  vibe         text[],
  notes        text,
  link         text,
  location     text,
  est_cost     text check (est_cost in ('$','$$','$$$','$$$$')),
  est_duration text check (est_duration in ('<1h','2-3h','half-day','full-day','weekend','longer')),
  status       text not null default 'backlog' check (status in ('backlog','planned','done')),
  scheduled_at timestamptz,
  done_at      timestamptz,
  rating       int check (rating between 1 and 5),
  done_note    text,
  this_week    boolean not null default false,
  created_by   uuid references auth.users(id) not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger activities_updated_at
  before update on activities
  for each row execute function update_updated_at();

-- Enable Realtime
alter publication supabase_realtime add table activities;

-- RLS: only the two seeded users (by email) can read and write
alter table activities enable row level security;

-- Helper: the two allowed emails (update with actual addresses)
-- In production, seed users via Supabase Auth dashboard and reference auth.users.id directly.
-- Here we restrict by email domain / allow-list.

create policy "lufa_read" on activities
  for select using (
    auth.uid() in (
      select id from auth.users where email in (
        '86.fabian@googlemail.com',  -- Fabian
        'luca@example.com'            -- Luca — update with real address
      )
    )
  );

create policy "lufa_insert" on activities
  for insert with check (
    auth.uid() = created_by
    and auth.uid() in (
      select id from auth.users where email in (
        '86.fabian@googlemail.com',
        'luca@example.com'
      )
    )
  );

create policy "lufa_update" on activities
  for update using (
    auth.uid() in (
      select id from auth.users where email in (
        '86.fabian@googlemail.com',
        'luca@example.com'
      )
    )
  );

create policy "lufa_delete" on activities
  for delete using (
    auth.uid() in (
      select id from auth.users where email in (
        '86.fabian@googlemail.com',
        'luca@example.com'
      )
    )
  );
