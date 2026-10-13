-- Schema for a private, single-owner rebuild of Teamily's core features.
-- Postgres on Supabase. Access: row level security, every owned row has
-- user_id = auth.uid(). Built-in agents have user_id null and are read-only.
-- All times timestamptz (UTC). No money columns: no billing in v1.

create extension if not exists pgcrypto;

-- shared trigger to keep updated_at current
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- profiles
-- one row per auth user (only the owner in v1)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  locale text not null default 'zh-Hant',
  time_zone text not null default 'Asia/Hong_Kong',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ agents
create table agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = built-in
  name text not null check (length(name) between 1 and 80),
  description text not null default '',
  avatar_url text,
  category text not null default 'other' check (category in (
    'content_creation','customer_support','data_analysis','design','education',
    'engineering','finance','it_security','investment','legal','life',
    'marketing','other')),
  system_prompt text not null,
  model text not null default 'claude-opus-5-5',
  effort text not null default 'medium'
    check (effort in ('low','medium','high','xhigh','max')),
  tools text[] not null default '{}',          -- e.g. {memory,web_artifact,web_search}
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index agents_name_per_owner on agents (user_id, lower(name));
create index on agents (category);

create table agent_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = built-in
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agent_team_agents (
  team_id uuid not null references agent_teams(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  position int not null default 0,
  primary key (team_id, agent_id)
);
create index on agent_team_agents (agent_id);

-- ----------------------------------------------------------- conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('dm','group')),
  title text,                                  -- null for a dm: use the agent's name
  pinned_at timestamptz,                       -- not null = pinned
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on conversations (user_id, pinned_at desc nulls last, last_message_at desc nulls last);

create table conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, -- owner of the row
  member_user_id uuid references auth.users(id) on delete cascade,
  member_agent_id uuid references agents(id) on delete cascade,
  joined_at timestamptz not null default now(),
  constraint one_member check ((member_user_id is null) <> (member_agent_id is null))
);
create unique index on conversation_members (conversation_id, member_agent_id) where member_agent_id is not null;
create unique index on conversation_members (conversation_id, member_user_id) where member_user_id is not null;
create index on conversation_members (member_agent_id);

-- ---------------------------------------------------------------- messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, -- owner of the row
  sender_kind text not null check (sender_kind in ('user','agent','system')),
  sender_agent_id uuid references agents(id) on delete set null,
  body text not null default '',               -- markdown
  attachments jsonb not null default '[]',     -- [{path, name, mime, size}]
  status text not null default 'complete'
    check (status in ('streaming','complete','failed')),
  client_id uuid,                              -- idempotency key from the composer
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_sender check ((sender_kind = 'agent') = (sender_agent_id is not null))
);
create index on messages (conversation_id, created_at);
create unique index on messages (user_id, client_id) where client_id is not null;
create index messages_fts on messages using gin (to_tsvector('simple', body));

-- ---------------------------------------------------------- automations
create table automations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_key text,                           -- e.g. 'daily_brief'; templates live in code
  agent_id uuid not null references agents(id) on delete restrict,
  conversation_id uuid not null references conversations(id) on delete cascade, -- where results post
  name text not null,
  prompt text not null,
  cron text not null,                          -- 5-field cron, read in time_zone
  time_zone text not null default 'Asia/Hong_Kong',
  status text not null default 'active' check (status in ('active','paused')),
  next_run_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on automations (status, next_run_at);
create index on automations (user_id);
create index on automations (agent_id);
create index on automations (conversation_id);

-- --------------------------------------------------------------- agent runs
-- one run = one agent answering one message or one automation firing
create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  trigger text not null check (trigger in ('message','automation')),
  trigger_message_id uuid references messages(id) on delete set null,
  automation_id uuid references automations(id) on delete set null,
  scheduled_for timestamptz,                   -- automation slot this run covers
  output_message_id uuid references messages(id) on delete set null,
  status text not null default 'queued'
    check (status in ('queued','running','done','failed','cancelled')),
  plan jsonb not null default '[]',            -- [{title, status}] for the plan card
  error text,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cache_read_tokens int not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on agent_runs (status, created_at);
create index on agent_runs (conversation_id, created_at);
create index on agent_runs (agent_id);
create index on agent_runs (user_id);
create index on agent_runs (trigger_message_id);
create index on agent_runs (output_message_id);
-- an agent answers a given message once, an automation slot fires once
create unique index on agent_runs (trigger_message_id, agent_id) where trigger_message_id is not null;
create unique index on agent_runs (automation_id, scheduled_for) where automation_id is not null;

-- ---------------------------------------------------------------- artifacts
create table artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in
    ('website','doc','slides','pdf','image','video','audio','message')),
  title text not null,
  content text,                                -- html / markdown for website, doc, slides
  storage_path text,                           -- Supabase Storage for binary files
  source_message_id uuid references messages(id) on delete set null,
  source_run_id uuid references agent_runs(id) on delete set null,
  starred_at timestamptz,
  last_opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint has_body check (content is not null or storage_path is not null)
);
create index on artifacts (user_id, kind, last_opened_at desc nulls last);
create index on artifacts (user_id, starred_at desc) where starred_at is not null;
create index on artifacts (source_message_id);
create index on artifacts (source_run_id);
create unique index on artifacts (source_message_id) where kind = 'message';

-- ------------------------------------------------------------ memory wiki
create table wiki_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,                          -- target of [[slug]] links
  title text not null,
  body text not null default '',               -- markdown with [[links]]
  topic text not null default 'uncategorized',
  tags text[] not null default '{}',
  special text check (special in ('profile','next_actions','outputs')),
  updated_by_kind text not null default 'user' check (updated_by_kind in ('user','agent')),
  updated_by_agent_id uuid references agents(id) on delete set null,
  search tsvector generated always as
    (to_tsvector('simple', title || ' ' || body)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index on wiki_pages (user_id, slug);
create unique index on wiki_pages (user_id, special) where special is not null;
create index on wiki_pages (user_id, topic, updated_at desc);
create index on wiki_pages using gin (tags);
create index on wiki_pages using gin (search);
create index on wiki_pages (updated_by_agent_id);

create table wiki_links (
  from_page_id uuid not null references wiki_pages(id) on delete cascade,
  to_page_id uuid not null references wiki_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (from_page_id, to_page_id),
  constraint no_self_link check (from_page_id <> to_page_id)
);
create index on wiki_links (to_page_id);
create index on wiki_links (user_id);

-- ---------------------------------------------------------- updated_at
do $$
declare t text;
begin
  foreach t in array array['profiles','agents','agent_teams','conversations',
    'messages','automations','agent_runs','artifacts','wiki_pages']
  loop
    execute format('create trigger %I_updated_at before update on %I
      for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- --------------------------------------------------------------------- RLS
alter table profiles enable row level security;
create policy own on profiles for all using (id = auth.uid()) with check (id = auth.uid());

alter table agents enable row level security;
create policy read_own_or_builtin on agents for select using (user_id = auth.uid() or user_id is null);
create policy write_own on agents for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table agent_teams enable row level security;
create policy read_own_or_builtin on agent_teams for select using (user_id = auth.uid() or user_id is null);
create policy write_own on agent_teams for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table agent_team_agents enable row level security;
create policy read_visible on agent_team_agents for select using (
  exists (select 1 from agent_teams t where t.id = team_id and (t.user_id = auth.uid() or t.user_id is null)));
create policy write_own on agent_team_agents for all using (
  exists (select 1 from agent_teams t where t.id = team_id and t.user_id = auth.uid()))
  with check (exists (select 1 from agent_teams t where t.id = team_id and t.user_id = auth.uid()));

do $$
declare t text;
begin
  foreach t in array array['conversations','conversation_members','messages',
    'automations','agent_runs','artifacts','wiki_pages','wiki_links']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy own on %I for all using (user_id = auth.uid())
      with check (user_id = auth.uid())', t);
  end loop;
end $$;

-- the agent worker uses the service role key and bypasses RLS; it must set
-- user_id from the run it is processing, never from model output.
