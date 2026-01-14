-- Create chat messages table for AI coach conversations
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null, -- user or assistant
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.chat_messages enable row level security;

create policy "messages_select_own"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "messages_insert_own"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "messages_delete_own"
  on public.chat_messages for delete
  using (auth.uid() = user_id);
