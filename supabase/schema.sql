-- Run this in your Supabase project's SQL Editor (Database → SQL Editor → New query)

-- Profiles
create table profiles (
  user_id uuid references auth.users on delete cascade primary key,
  character_name text not null default 'Adventurer'
);

-- Stats
create table stats (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  abbreviation text not null,
  color text not null,
  icon text not null,
  xp integer not null default 0,
  level integer not null default 1,
  "order" integer not null default 0,
  primary key (id, user_id)
);

-- Habits
create table habits (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text not null default '',
  frequency text not null default 'daily',
  linked_stat_ids text[] not null default '{}',
  color text not null default '#3b82f6',
  icon text not null default '🎯',
  created_at timestamptz not null,
  archived_at timestamptz,
  primary key (id, user_id)
);

-- Log entries
create table log_entries (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  habit_id text not null,
  date text not null,
  completed_at timestamptz not null,
  primary key (id, user_id)
);

-- ── Row Level Security ────────────────────────────────────────────────────

alter table profiles   enable row level security;
alter table stats      enable row level security;
alter table habits     enable row level security;
alter table log_entries enable row level security;

-- Each user can only see and modify their own rows
create policy "profiles: own rows"    on profiles    for all using (auth.uid() = user_id);
create policy "stats: own rows"       on stats       for all using (auth.uid() = user_id);
create policy "habits: own rows"      on habits      for all using (auth.uid() = user_id);
create policy "log_entries: own rows" on log_entries for all using (auth.uid() = user_id);
