-- Create lifestyle assessments table
create table if not exists public.lifestyle_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  age integer,
  gender text,
  sleep_hours integer,
  activity_level text, -- sedentary, moderate, active
  stress_level text, -- low, moderate, high
  eating_habits text, -- poor, average, good
  screen_time integer, -- hours per day
  water_intake integer, -- glasses per day
  common_issues text[], -- headache, fatigue, weight_gain, low_energy
  lifestyle_classification jsonb, -- AI analysis results
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.lifestyle_assessments enable row level security;

create policy "assessments_select_own"
  on public.lifestyle_assessments for select
  using (auth.uid() = user_id);

create policy "assessments_insert_own"
  on public.lifestyle_assessments for insert
  with check (auth.uid() = user_id);

create policy "assessments_update_own"
  on public.lifestyle_assessments for update
  using (auth.uid() = user_id);

create policy "assessments_delete_own"
  on public.lifestyle_assessments for delete
  using (auth.uid() = user_id);
