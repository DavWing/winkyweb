# Build log

App code: private repo `DavWing/agent-workspace` (Next.js 16, Tailwind v4,
tokens from `design/`). Data and agent replies are a demo layer until
`/replica-backend` (Supabase + Claude API). Checked with a 49-step browser
run (keyboard flow, mobile 390px, axe-core, console errors), passing twice in
a row.

| screen | date | status | missing | harder than expected |
| --- | --- | --- | --- | --- |
| shell | 2026-10-13 | done | real sign-in (S01) | Next 16 Cache Components: anything reading the URL or the store must sit in `<Suspense>`; the rail is a static view with the active highlight streamed in |
| S03 conversation list | 2026-10-13 | done | unread counts (no read tracking yet), "+" goes to the agent directory instead of a new-chat menu | Next keeps the previous screen alive but hidden, so "is a chat open" on phones had to come from the URL, not from the page tree |
| S04 chat | 2026-10-13 | partial | search in chat, Invite and Workspace go to placeholders, demo replies | live updates need one transport hook so Supabase Realtime can replace server-sent events without touching screens |
| S05 composer | 2026-10-13 | partial | attachments, tools, connectors, voice, speed select (all shown disabled, labelled "coming soon") | @mention picker as an accessible combobox |
| S06 plan + page cards | 2026-10-13 | partial | real plans and pages need the Claude API | page previews are untrusted HTML: sandboxed iframes without same-origin, scaled to 50% |
| S08 agent directory | 2026-10-13 | done | Agent teams tab is a placeholder (S09) | |
| S17 page viewer | 2026-10-13 | done (website kind) | docs, images and other kinds | |
| S01, S02, S07, S09-S16, S18, S19 | 2026-10-13 | route only | whole screen | |

Bigger than it looked: nothing yet beyond the notes above. Real agent work
(Claude API, memory tools, background runs) is the large piece and lands in
`/replica-backend`.
