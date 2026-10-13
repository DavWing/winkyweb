# Recon map: Teamily AI (web, teamily.ai/chat)

Scope: the core messenger loop. Direct messages and group chats where humans
and custom AI agents are both members, plus @mentioning an agent to run a task
with a visible plan, and memory that carries across chats. Studios (web apps,
slides, docs, dashboards), calls, office suite and Agent Hub are listed but
set to could or skip.
For: TBD (to confirm with the owner)
Date: 2026-10-13

> **Confidence warning.** This environment's network policy blocked
> teamily.ai and every third-party page, so nothing below comes from looking
> at the app. It is built from web-search summaries of the sources listed.
> No screenshots were taken. Screens, routes and components are inferred and
> marked as such. Before building, walk through the app in your own account
> and correct this file (Step "Gaps to close" at the bottom).

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | web app (target) | https://teamily.ai/chat | blocked from this environment, not seen |
| 2 | marketing site | https://teamily.ai/ | "always-on agents ... one unified and context-aware space" |
| 3 | about page | https://teamily.ai/about | "+ New Agent" button, agent shows in contact list, prompt-built agents |
| 4 | pricing page | https://teamily.ai/pricing | Free / Plus $19.99 / Premium $99.99 / Pro $199.99 |
| 5 | changelog | https://teamily.ai/changelog | web-v2.0.2: Studio webapp builder, Agent Hub, public agent profiles |
| 6 | help center | https://teamily.ai/about/help-center | not reached, highest-value gap |
| 7 | group invite page | https://teamily.ai/invite/group/3176557915 | invite link pattern `/invite/group/{id}` |
| 8 | download page | https://teamily.ai/download | iOS, Android, Mac, Windows |
| 9 | App Store listing | https://apps.apple.com/us/app/teamily-ai-human-ai-team/id6761445638 | feature list, v2.0.8 "Artifacts: Shared Docs, Whiteboard" |
| 10 | Google Play listing | https://play.google.com/store/apps/details?id=ai.teamily.mobile | Productivity, free with IAP |
| 11 | blog: agent teams | https://blog.teamily.ai/teamily-ai-brings-agent-teams-to-human-teams/ | agents as named group members, mention, assign, parallel jobs |
| 12 | blog: what is Teamily | https://blog.teamily.ai/what-is-teamily-ai/ | positioning, global memory |
| 13 | Forbes | https://www.forbes.com/sites/charliefink/2026/03/06/teamily-ai-brings-agent-teams-to-human-teams/ | demo: tasks split into subtasks, visible execution plan in chat |
| 14 | public launch PR | https://www.businesswire.com/news/home/20260708584390/en/Teamily-AI-Publicly-Launches-HumanAI-Social-Platform-to-Make-Building-and-Growing-a-Company-Easy-for-Every-Team | July 2026 launch |
| 15 | directory listing | https://www.aitoolsspace.com/en/tools/teamily | credit amounts per tier (unverified) |
| 16 | critical coverage | https://ucstrategies.com/news/teamily-raised-20m-betting-people-will-pay-to-keep-ai-group-conversations-going/ | usage limits, ads or upgrade on free |

## Core loop

You chat in a group with people and your own AI agents; you @mention an agent,
it plans and runs the task in the thread while everyone keeps talking, and it
remembers context from every chat.

## Screens

All routes except `/chat`, `/pricing`, `/invite/group/{id}` are guesses.

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Sign in / sign up | `/login` (guess), redirect from `/chat` when signed out | create account, sign in | auth form, OAuth buttons | not seen |
| S02 | Onboarding | after first sign-up (guess) | name, avatar, first agent | stepper, avatar picker | not seen |
| S03 | Chat home (conversation list + empty pane) | `/chat` | list of DMs, groups, agents; pick one | sidebar nav, search, conversation list, "new" menu | not seen; need empty (new user) and filled |
| S04 | Conversation thread (DM) | `/chat/{id}` (guess) | 1:1 with a person or an agent | message list, composer, attachments, voice input | not seen |
| S05 | Conversation thread (group) | `/chat/{id}` (guess) | humans + agents together | member avatars, @mention picker, task cards | not seen |
| S06 | Task / execution plan card | inline in S05 | agent shows plan, steps, progress, result | step list, progress, status chips, result attachment | inferred from Forbes demo |
| S07 | New group | "new" menu in S03 | pick members and agents, name group | member picker, name input | not seen |
| S08 | Group info / settings | header of S05 | members, add agent, invite link, sponsor AI usage | member list, invite link copy, toggles | inferred from pricing ("sponsor your group's AI usage") |
| S09 | Invite landing | `/invite/group/{id}` | accept invite, join group | group preview, join button | page exists, contents not seen |
| S10 | Contacts / agents list | sidebar tab (guess) | people and agents you can message | list, "+ New Agent" | inferred from about page |
| S11 | Create / edit agent | "+ New Agent" | name, avatar, prompt, skills, connectors | form, prompt textarea, toggles | inferred |
| S12 | Agent profile (public) | profile page (changelog) | public page for an agent | avatar, description, start chat | inferred from changelog |
| S13 | Memory view | settings or sidebar (guess) | see and edit what agents remember | list of memories, delete | guess; may not exist as a screen |
| S14 | Settings / account | avatar menu | profile, language, connectors, plan | tabs, forms | not seen |
| S15 | Plans / upgrade | `/pricing`, upgrade prompts | Free, Plus, Premium, Pro | plan cards, checkout | page exists, layout not seen |
| S16 | Usage limit / paywall modal | when credits run out | upgrade or watch ad (mobile) | modal, plan CTA | inferred from coverage |
| S17 | Studio (web app / slides / docs) | from a task result | edit an artifact with agents | editor, live preview, share link | out of core scope |

## Flows

```
F01 New user starts chatting with an agent
    S01 -> S02 -> S03 -> S04
    happy path clicks: unknown (estimate 5-7)
    edge: OAuth cancelled, email already used, no agents yet (empty state)

F02 Create a custom agent
    S03 -> S10 -> S11 -> S04 (agent DM opens)
    happy path clicks: ~4 ("+ New Agent", name, prompt, save)
    edge: free plan at 5-agent limit, empty prompt, duplicate name

F03 Start a group with people and agents
    S03 -> S07 -> S05
    happy path clicks: ~5
    edge: inviting someone not on the app (invite link), group size limit per plan

F04 Invite someone by link
    S05 -> S08 (copy link) ... invitee: S09 -> S01 (if signed out) -> S05
    edge: expired / revoked link, already a member, signed-out invitee

F05 @mention an agent to run a task (the core loop)
    S05: type "@" -> pick agent -> write request -> send -> S06 plan appears
         -> steps run while chat continues -> result posted
    happy path clicks: 3 + typing
    edge: concurrent-task limit hit (2 on free), credits out (S16), task fails
          mid-plan, two agents mentioned at once, someone else cancels

F06 Agent recalls context from another chat
    S04/S05: ask about something said elsewhere -> agent answers using memory
    edge: memory from a group the asker is not in (privacy), user deletes a memory

F07 Upgrade
    S16 or S14 -> S15 -> checkout -> back to S05 with limit lifted
    edge: trial (3 days on Plus), payment fails, downgrade over agent limit
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button | primary, secondary, ghost, danger, icon | default, hover, focus, disabled, loading | all |
| Sidebar nav | chats, contacts/agents, settings (guess) | active, collapsed (mobile) | S03-S05, S10 |
| Conversation list item | DM, group, agent | unread, active, muted, typing | S03 |
| Message bubble | own, other human, agent, system | sending, sent, failed, streaming (agent) | S04, S05 |
| Composer | text, with attachment, voice | empty, typing, @mention open, disabled (limit) | S04, S05 |
| Mention picker | humans, agents | filtered, empty | S05 |
| Task / plan card | running, done, failed, cancelled | step pending/running/done | S05, S06 |
| Avatar | human, agent (with badge), group stack | online, offline | everywhere |
| Member picker | people, agents | selected, disabled (limit) | S07, S08 |
| Modal | confirm, paywall, invite | open, closed | S08, S16 |
| Toast | success, error, info | | all |
| Plan card | Free, Plus, Premium, Pro | current, recommended | S15 |
| Form fields | text, textarea, toggle, select, file | default, focus, error, disabled | S01, S11, S14 |

## Inferred data model

```
User         id, name, avatar_url, email, plan (free|plus|premium|pro),
             credits_balance, created_at
             evidence: pricing page, directory credit amounts
             confidence: high (user, plan) / medium (credits)

Agent        id, owner_id -> User, name, avatar_url, system_prompt, model,
             skills[] / connectors[], is_public, created_at
             evidence: about page ("+ New Agent", prompt-built), pricing (agent
             limits, connectors), changelog (public agent profiles)
             confidence: high (existence) / guess (field list)

Conversation id, kind (dm | group), title, avatar_url, created_by,
             sponsor_user_id (who pays the group's AI usage), created_at
             evidence: pricing ("sponsor your group's AI usage"), invite page
             confidence: high (kind) / medium (sponsor)

Member       conversation_id, member_type (user | agent), member_id,
             role (owner | admin | member), joined_at, last_read_message_id
             evidence: blog ("agents appear as named members")
             confidence: high

Message      id, conversation_id, sender_type (user | agent | system), sender_id,
             body, attachments (json), mentions[], reply_to_id, task_id,
             created_at, edited_at
             evidence: App Store (text, voice, images, files)
             confidence: high

Task         id, conversation_id, agent_id, requested_by, prompt,
             status (queued | running | done | failed | cancelled),
             plan (json: steps with status), result_artifact_id,
             credits_used, started_at, finished_at
             evidence: Forbes demo (decomposed subtasks, visible plan),
             pricing (concurrent task limits)
             confidence: medium

Memory       id, owner (user | agent), source_conversation_id, content,
             embedding, created_at, updated_at
             evidence: "living memory that builds and reorganizes itself"
             confidence: guess (structure)

Invite       id / code, conversation_id, created_by, expires_at, revoked
             evidence: /invite/group/{id}
             confidence: medium

Artifact     id, kind (webapp | slides | doc | dashboard | whiteboard),
             conversation_id, created_by_task_id, share_url, content
             evidence: studios, v2.0.8 "Artifacts: Shared Docs, Whiteboard"
             confidence: medium (out of core scope)

Subscription user_id, plan, status, trial_ends_at, provider_ref
             evidence: pricing (3-day trial)
             confidence: high
```

Relationships: User 1-n Agent; Conversation n-n (User | Agent) via Member;
Conversation 1-n Message; Conversation 1-n Task; Agent 1-n Task;
Task 0-1 Artifact; User/Agent 1-n Memory; Conversation 1-n Invite;
User 1-1 Subscription.

## Feature matrix

See `features.csv`. Must: 13, should: 9, could: 8, skip: 4.

## Out of scope (cannot or should not be cloned)

- Teamily's users and network (the "social network" part is its people).
- Its agent catalogue, public agents and any partner connector deals.
- Its models and model deals; a clone uses its own LLM provider and pays for it.
- Its brand, name, logo, copy, mascot or illustrations.
- Ad-supported credits on mobile (ad network deals).

## Size

Screens 17 (12 in core scope), flows 7, entities 10.
Hard parts:
1. Realtime multi-party chat with agents streaming replies into a shared thread.
2. Agent task runner: planning, step execution, concurrency limits, credits
   metering, and keeping the plan card live while chat continues.
3. Cross-chat memory with correct privacy (never leak group A's context into
   group B for someone not in A).
Also: per-plan limits and billing, invite links, file and voice uploads.
Size: **L** for the core slice (a quarter for one developer). Adding studios,
calls or the office suite pushes it to XL: rescope before starting those.

## Gaps to close (do these in your own account before /replica-architect)

1. Open https://teamily.ai/chat signed in and screenshot S03-S08, S10, S11
   into `replica/screens/` (names `S03-chat-home.png` etc.). Check the terms of
   service first for any ban on using an account to build a competing product.
2. Record real routes and fix the "guess" rows above.
3. Read the help center (source 6) and add any settings the screens miss.
4. Count the real clicks for F01, F02, F05.
5. Confirm whether memory has its own screen (S13).
