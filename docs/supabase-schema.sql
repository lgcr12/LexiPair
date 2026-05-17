create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  streak integer not null default 0,
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists word_groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  type text not null,
  level text not null,
  source text not null,
  tags text[] not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists word_books (
  id text primary key,
  name text not null,
  subtitle text not null,
  cover_color text not null default '#0A84FF',
  created_at timestamptz not null default now()
);

create table if not exists word_book_groups (
  book_id text not null references word_books(id) on delete cascade,
  group_id uuid not null references word_groups(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (book_id, group_id)
);

create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references word_groups(id) on delete cascade,
  word text not null,
  phonetic text,
  pos text,
  meaning text not null,
  hint text,
  collocation text,
  sentence text,
  misuse text,
  sort_order integer not null default 0
);

create table if not exists study_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references word_groups(id) on delete cascade,
  count integer not null default 0,
  know integer not null default 0,
  blurry integer not null default 0,
  forgot integer not null default 0,
  last_result text,
  last_word text,
  favorite boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, group_id)
);

create table if not exists notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references word_groups(id) on delete cascade,
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, group_id)
);

create table if not exists ai_insights (
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references word_groups(id) on delete cascade,
  summary text not null,
  mnemonic text not null,
  contrast text not null,
  quiz text not null,
  examples jsonb not null default '[]',
  generated_at timestamptz not null default now(),
  primary key (user_id, group_id)
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  platform text not null,
  last_seen_at timestamptz not null default now()
);

create table if not exists account_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  data jsonb not null default '{}'::jsonb,
  synced_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists study_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id text not null,
  result text not null check (result in ('know', 'blurry', 'forgot')),
  word text,
  stage text,
  level integer,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table word_groups enable row level security;
alter table word_books enable row level security;
alter table word_book_groups enable row level security;
alter table words enable row level security;
alter table study_progress enable row level security;
alter table notes enable row level security;
alter table ai_insights enable row level security;
alter table devices enable row level security;
alter table account_snapshots enable row level security;
alter table study_events enable row level security;

create policy "profiles are self readable" on profiles for select using (auth.uid() = id);
create policy "profiles are self writable" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "read public or own groups" on word_groups for select using (is_public or auth.uid() = owner_id);
create policy "write own groups" on word_groups for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "read books" on word_books for select using (true);
create policy "read book groups" on word_book_groups for select using (true);

create policy "read words through visible groups" on words for select using (
  exists (
    select 1 from word_groups
    where word_groups.id = words.group_id
    and (word_groups.is_public or word_groups.owner_id = auth.uid())
  )
);

create policy "progress is private" on study_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes are private" on notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai insights are private" on ai_insights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "devices are private" on devices for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "account snapshots are private" on account_snapshots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "study events are private" on study_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
