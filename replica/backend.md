# Backend

App repo: `DavWing/agent-workspace` (private). Supabase project
`agent-workspace` (ref `hvzgtwjgbfmhfdplppbx`, ca-central-1, free plan),
created 2026-10-13.

## What is built

| part | how | status |
| --- | --- | --- |
| Database | 4 migrations in `supabase/migrations`; 12 tables, RLS on every table, 15 ready-made agents and 2 teams seeded | applied (0004 waits for owner approval, optional) |
| Access rules | RLS `user_id = auth.uid()` on owned rows; built-ins read-only; anon sees nothing | tested live with two users (see below) |
| Auth | Supabase email links (PKCE), owner-only via `OWNER_EMAIL`, same answer for every address, `proxy.ts` session refresh + redirect, every route handler re-checks | built; live sign-in not tested from this environment |
| Sign out | "Sign out on every device" (global scope) in Settings | built |
| Data layer | `src/lib/data/db.ts`, same functions as the demo layer | built, typechecked; not run against the live DB from here |
| Live updates | Supabase Realtime postgres_changes on messages, agent_runs, artifacts (RLS-filtered) | built; not run live |
| Agent runs | Claude API, streaming manual tool loop, `claude-opus-5-5` at the agent's effort, refusal fallbacks on (`server-side-fallback-2026-07-01`, `fallbacks: "default"`), prompt caching on agent prompt + memory index, max 8 turns, token use stored per run | built; 15-check test against a mock API passes; no live call (no key yet) |
| Agent tools | memory_search / memory_read / memory_write (with [[links]]), create_web_page (stored as an artifact) | built and covered by the mock test |
| Payments | none: private tool, no billing | not needed |
| Email | Supabase's built-in sender for sign-in links only | default; custom SMTP before others ever sign in |
| Jobs | automations scheduler | not built yet (S11/S12 come first); needs the secret key, not the owner session |

Live RLS test (2026-10-13, inside a rolled-back transaction): profiles created
by trigger 2/2; second user sees 0 of the owner's chats, messages, memory,
profile; updates 0 built-in agents and 0 owner messages; forging a message as
the owner refused (42501); anon sees 0 agents and 0 messages; owner sees 15
built-in agents and their own message.

## Owner to-do

1. Allow `*.supabase.co` in this cloud environment's network settings if you
   want me to run the live app end to end from here (it is blocked now).
2. Supabase → Authentication → URL configuration: Site URL and redirect URL
   `http://localhost:3000/auth/callback` (plus the deployed URL later).
3. `.env.local` (and the host's env later): `OWNER_EMAIL`, `ANTHROPIC_API_KEY`.
4. After your first sign-in: turn off "Allow new users to sign up".
5. Optional: run `0004_drop_catchall_write_policies.sql` in the SQL editor.
6. Backups: the free plan has no point-in-time recovery; daily backups need
   Pro. For a private tool, decide whether that matters before relying on it.

## Integrations

| integration | API | scopes / keys | review | limits |
| --- | --- | --- | --- | --- |
| Claude | Messages API, official TypeScript SDK | `ANTHROPIC_API_KEY`, server only | none | per-key rate limits; SDK retries 429/5xx twice |
| Supabase | supabase-js / ssr | publishable key (public), secret key only for future automations | none | free plan: 2 active projects, built-in email sender is heavily rate limited |
| Gmail / GitHub / Slack (could) | official APIs | not started | Google OAuth verification takes weeks before others can use it: start early if ever needed | |

## Security checklist

- [x] secrets only in env vars, `.env*` ignored (only `.env.example` committed), no secret in the client bundle (checked the build)
- [x] input validated on the server (zod) on every route that takes input
- [x] authorisation on every read and write: RLS, plus owner check in every route handler, tested live with a second user
- [x] rate limits on sign-in: Supabase's built-in email-link limits (no sign-up form exists)
- [ ] webhooks verify signatures: no webhooks yet
- [x] uploads: none yet; generated pages are served only in sandboxed iframes without same-origin
- [x] no user data in URLs or logs (ids only)
- [x] dependencies audited: production 0 vulnerabilities; 5 high in dev-only lint tooling (`braces` via eslint-config-next), not shipped
- [ ] privacy policy: not needed while the app has one user; lists Supabase, Anthropic and the host if that changes
