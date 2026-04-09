-- Creator Life OS — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create table if not exists user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  state jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table user_data enable row level security;

create policy "Users can read own data"
  on user_data for select
  using (auth.uid() = user_id);

create policy "Users can insert own data"
  on user_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update own data"
  on user_data for update
  using (auth.uid() = user_id);
