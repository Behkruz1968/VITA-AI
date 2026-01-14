-- Create daily logs table for tracking habits
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  energy_level integer, -- 1-10
  mood text, -- great, good, okay, low
  water_glasses integer,
  sleep_quality integer, -- 1-10
  exercise_done boolean default false,
  exercise_minutes integer,
  meals_logged jsonb, -- array of meal entries
  daily_task_completed boolean default false,
  daily_task text,
  ai_suggestion text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, log_date)
);

alter table public.daily_logs enable row level security;

create policy "logs_select_own"
  on public.daily_logs for select
  using (auth.uid() = user_id);

create policy "logs_insert_own"
  on public.daily_logs for insert
  with check (auth.uid() = user_id);

create policy "logs_update_own"
  on public.daily_logs for update
  using (auth.uid() = user_id);

create policy "logs_delete_own"
  on public.daily_logs for delete
  using (auth.uid() = user_id);
