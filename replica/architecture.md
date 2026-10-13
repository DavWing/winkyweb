# Architecture: your private agent workspace (a rebuild of Teamily's core features)

Built for one owner (you). That removes billing, public sign-up and
multi-tenant access rules from v1, and keeps one database, one app, one worker.
Inputs: `recon.md`, `features.csv`. SQL: `schema.sql` (loaded and
RLS-tested on Postgres 16 on 2026-10-13).

## Stack

| layer | choice | why |
| --- | --- | --- |
| web | Next.js (App Router) + TypeScript, its own repo (not this Jekyll site) | server components for lists, route handlers for the API, one codebase |
| styling | Tailwind, tokens from `/replica-design` | |
| database | Postgres on Supabase | you already have Supabase connected; RLS, Realtime and Storage come with it |
| ORM | none: `supabase-js` + SQL migrations | the schema is small, and RLS does the access checks |
| auth | Supabase Auth, email magic link, **sign-ups disabled** after your account exists | private tool, one user |
| realtime | Supabase Realtime: broadcast for streaming tokens, postgres_changes for new messages and run status | replies stream even if you reload or open a second tab |
| AI | Claude API via `@anthropic-ai/sdk`, server-side only, default model `claude-opus-5-5` | agents, tool use, streaming, prompt caching |
| files | Supabase Storage, private bucket, signed URLs | attachments and binary artifacts |
| jobs | Netlify Background Functions (agent runs) + one Netlify Scheduled Function (automations) | agent runs take minutes, longer than a normal request |
| hosting | Netlify | you already deploy there (Wings) and have it connected |
| payments, email | none | not needed for a private tool |

Check Netlify's current function limits before building. At the time of
writing: background functions get about 15 minutes, scheduled functions
about 30 seconds, and normal functions much less. That is why agent work never
runs inside the web request.

### How an agent reply works

```
composer ─POST /api/conversations/:id/messages─▶ insert message + agent_runs(queued)
                                                │
                                                └─▶ invoke agent-run-background(run_id)
background worker:
  load agent, thread, memory index ─▶ Claude (stream, tools) ─┬─▶ broadcast deltas  conv:{id}
                                                              ├─▶ run tools (memory, artifact)
                                                              └─▶ write final message, run=done
browser: subscribed to conv:{id} ─▶ renders streaming text, plan card, artifact card
```

### Claude request shape (per run)

- `model`: the agent's `model` column (default `claude-opus-5-5`, $4 / $20 per
  million tokens in/out). `output_config.effort`: the agent's `effort` column,
  default `medium`. Set it explicitly: Opus 5.5 ignores the old "disable
  thinking" setting and returns a 400.
- Streaming always; `max_tokens` ~64000.
- `thinking: {type: "adaptive", display: "updates"}` (beta
  `thinking-display-updates-2026-08-18`): the model's short progress notes
  between tool calls feed the plan card (S06) for free.
- Refusals: always check `stop_reason` before reading content. Server-side
  fallbacks are on by default: beta `server-side-fallback-2026-07-01` with
  `fallbacks: "default"`. Turn them off if you don't want them.
- Tools, defined with `betaZodTool` and run by the SDK tool runner, with
  `eager_input_streaming: true`. Every tool input is validated against its
  schema before it runs.
  - `memory_search(query)`, `memory_read(slug)`, `memory_write(slug, title, body, topic, tags)`
  - `create_web_artifact(title, html)` and `create_doc_artifact(title, markdown)`
  - server tools when the agent's `tools` column includes them: `web_search_20260209`, `web_fetch_20260209`
- No forced `tool_choice` (Opus 5.5 rejects it); use `auto` and instructions.
- Prompt caching, in prefix order:
  1. tools, in a fixed order
  2. the agent's system prompt (breakpoint)
  3. a memory index: your profile page plus the titles and slugs of the wiki pages (breakpoint)
  4. the thread, with the current date in the latest user turn, never in the system prompt
  
  Check `usage.cache_read_input_tokens` and store the token counts on
  `agent_runs`.
- History is append-only within a run (no editing earlier turns). In group
  chats, an agent sees its own messages as `assistant` and everyone else's as
  `user` text prefixed with the sender's name.

## Schema

Tables: 12. Access rules: Postgres row level security (`user_id =
auth.uid()` on every owned row; built-in agents and teams have `user_id null`
and are read-only). The worker uses the service-role key and bypasses RLS, so
it takes `user_id` from the run row, never from model output.

| table | holds | screens |
| --- | --- | --- |
| profiles | name, locale, time zone | S18 |
| agents | prompt, model, effort, tools, category | S08, S10 |
| agent_teams, agent_team_agents | prebuilt groups of agents | S09 |
| conversations | dm or group, pinned, last activity | S03 |
| conversation_members | which agents (or people) are in a chat | S04, S19 |
| messages | markdown body, attachments, streaming status | S04 |
| agent_runs | one agent answering one message or one automation firing; plan, tokens | S06 |
| artifacts | websites, docs, saved messages, files | S06, S16, S17 |
| wiki_pages, wiki_links | memory pages with topics, tags, `[[links]]`, full-text search | S13, S14 |
| automations | cron, agent, prompt, target chat | S11, S12 |

Hard constraints in the database, not the UI:
- An agent answers a given message once: unique `(trigger_message_id, agent_id)`.
- An automation slot fires once even if two ticks overlap: unique `(automation_id, scheduled_for)`.
- A resent composer message is stored once: unique `(user_id, client_id)`.
- One profile, next-actions and outputs page per owner: unique `(user_id, special)`.
- An agent message must name its agent: check `agent_sender`.

## API

Route handlers under `/api`, all behind the Supabase session cookie ("owner"
below). The worker endpoints check a shared secret header.

### F01 Chat with an agent from the directory
| method path | does | who | input | output |
| --- | --- | --- | --- | --- |
| GET /agents (page) | directory with category and source filters | owner | `?category&source=builtin\|mine&q` | S08 |
| POST /api/agents/:id/chat | find or create the dm with this agent | owner | | `{conversationId}` → redirect to S04 |

### F02 Create my own agent
| POST /api/agents | create | owner | name, description, category, system_prompt, model, effort, tools | agent |
| --- | --- | --- | --- | --- |
| PATCH /api/agents/:id | edit (own only, RLS) | owner | same, partial | agent |
| DELETE /api/agents/:id | delete; refused while an automation uses it | owner | | 204 / 409 |

### F03 Ask for a deliverable (core loop)
| POST /api/conversations/:id/messages | store the message, queue one run per responding agent (dm: the agent; group: the agents @mentioned) and invoke the worker | owner | body, attachments, client_id | message, run ids |
| --- | --- | --- | --- | --- |
| POST /api/uploads | signed upload URL for Storage | owner | name, mime, size | url, path |
| POST /api/runs/:id/cancel | stop a run (worker checks between steps) | owner | | run |
| POST /.netlify/functions/agent-run-background | run the agent: stream, tools, final message | worker secret | run_id | 202 |
| realtime `conv:{id}` | `delta`, `plan`, `artifact`, `done`, `error` events | owner (RLS-checked channel) | | |
| GET /artifacts/:id (page) | full-screen viewer; HTML in a sandboxed iframe | owner | | S17 |

### F04 Group with several agents
| POST /api/conversations | new dm or group, optionally from an agent team | owner | kind, title, agent_ids or team_id | conversation |
| --- | --- | --- | --- | --- |
| POST /api/conversations/:id/members | add an agent | owner | agent_id | member |
| DELETE /api/conversations/:id/members/:memberId | remove | owner | | 204 |

### F05 Automations
| GET /automations (page) | templates (Work / Life, from code) and My automations | owner | `?tab` | S11 |
| --- | --- | --- | --- | --- |
| POST /api/automations | create from a template; computes next_run_at | owner | template_key, agent_id, conversation_id, prompt, cron, time_zone | automation |
| PATCH /api/automations/:id | edit, pause, resume | owner | partial | automation |
| POST /api/automations/:id/run | run now | owner | | run id |
| DELETE /api/automations/:id | delete | owner | | 204 |

### F06 Memory
| GET /memory (page) | page list by topic, graph, stats | owner | `?topic&tag&q` | S13 |
| --- | --- | --- | --- | --- |
| GET /api/memory/graph | nodes, links, counts (nodes, links, unlinked, topics) | owner | `?topic` | json |
| GET/PUT /api/memory/pages/:slug | read, create or update; re-parses `[[links]]` into wiki_links | owner | title, body, topic, tags | page |
| DELETE /api/memory/pages/:slug | delete (links cascade) | owner | | 204 |

### F07, F08 and search
| POST /api/messages/:id/save | save a message as an artifact (once) | owner | | artifact |
| --- | --- | --- | --- | --- |
| PATCH /api/artifacts/:id | star, rename, mark opened | owner | starred, title | artifact |
| PATCH /api/conversations/:id | pin, unpin, rename | owner | pinned, title | conversation |
| GET /api/search | messages and chats | owner | q | results |

Webhooks in: none. Webhooks out: none.

Jobs:
| job | schedule | does |
| --- | --- | --- |
| automation-tick | every 5 min | select active automations with `next_run_at <= now()`, insert a run per slot (the unique index makes overlaps harmless), advance `next_run_at` with a cron parser in the automation's time zone, invoke the worker |
| stuck-run-sweeper | every 15 min | mark runs `running` for over 20 min as `failed`, and their messages `failed` |

Only official APIs with your own keys: Claude API, Supabase, Netlify. Nothing
from Teamily's endpoints.

## The parts that bite

- **Long agent runs:** never inside a web request. Use a background function,
  stream through Realtime, and keep state in `agent_runs` so a reload picks up
  where it was.
- **Time zones:** cron is read in the automation's `time_zone` (default
  Asia/Hong_Kong) and `next_run_at` is stored in UTC. Hong Kong has no
  daylight saving, but a parser that handles it costs nothing.
- **Idempotency:** background functions can be retried, so the worker exits
  if the run is no longer `queued`. Composer resends are absorbed by
  `client_id`, automation ticks by the unique slot index.
- **Races:** two mentioned agents produce two runs that stream side by side,
  and messages are ordered by `created_at`. Cancelling sets a flag the worker
  checks between tool calls.
- **Rate limits and cost:** the SDK retries 429 and 5xx twice. Cap concurrent
  runs (e.g. 3) in the worker. Store tokens per run and show monthly spend in
  settings. Opus 5.5 at `medium` effort is the default, and you can lower
  effort per agent.
- **Refusals:** check `stop_reason`, mark the run `failed` with the reason,
  and never show an empty message as success.
- **Generated HTML is untrusted:** render web artifacts with
  `<iframe sandbox="allow-scripts" srcdoc=...>`, never `allow-same-origin`, so
  a generated page can't read your session.
- **Prompt injection into memory:** an agent that browses the web can be told
  by a page to write into your wiki. Pages written by agents are marked
  (`updated_by_kind`), and memory writes show in the chat as a visible tool
  step.
- **Search in Chinese:** the `simple` full-text config doesn't split Chinese
  words. It's fine for English and exact phrases. If search for Chinese text
  matters, switch to the `pgroonga` extension (available on Supabase) or add
  `ILIKE` as a fallback.
- **Realtime volume:** batch token deltas (~every 100 ms) instead of one
  broadcast per token.
- **File limits:** set a 25 MB upload cap; PDFs sent to Claude must be under
  32 MB per request.
- **Multi-tenancy:** none in v1. If you later invite people, RLS on messages
  must move from `user_id = auth.uid()` to "is a member of the conversation".
  That's the biggest change in this plan, so decide before inviting anyone.
- **Deleting data:** everything cascades from `auth.users`, so deleting your
  user deletes your data.

## Build order

1. **Vertical slice**: sign in, one seeded agent, chat with it, streamed reply.
   - Screens: S01, S03, S04 (no artifacts yet)
   - Tables: profiles, agents, conversations, conversation_members, messages, agent_runs
   - Routes: POST messages, agent-run-background, realtime `conv:{id}`
   - Proves Netlify background functions + Supabase Realtime + the Claude stream end to end.
2. **Must-haves** (`features.csv`):
   1. App shell with the icon rail; conversation list with search and sections.
   2. Agent directory (S08) and create/edit agent (S10), F01 and F02.
   3. Artifacts: `create_web_artifact` tool, artifact card (S06), viewer (S17), library (S16).
   4. Memory: wiki pages with topics and tags (S13 list, S14 page), memory tools and the memory index in the prompt.
   5. Long-message collapse, attachments and uploads.
3. **Should-haves:**
   1. Pin chats; group chats and Agent Teams (S09).
   2. Agents writing memory; graph view and stats; the three special pages.
   3. Automations (S11, S12) with automation-tick and the sweeper.
   4. Save a message as an artifact; new blank doc; voice input; mode selector.
4. **Could-haves:** connectors, prompt enhance, in-chat search, agent workspace panel, Explore.
5. **Fixes from `/replica-entrepreneur`:** once it has run.
