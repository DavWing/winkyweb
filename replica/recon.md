# Recon map: Teamily AI (web, teamily.ai/chat)

Scope: the core loop (chat with your own AI agents, one-on-one and in
groups) plus the four areas seen in the owner's screenshots: the agent
directory, automations, memory (a personal wiki with a graph view) and
artifacts. Calls, office suite, Agent Hub and mobile apps are out of the
first build.
For: the owner's own use (a private, single-owner tool, not a product to sell
yet). That means no billing, no plans, no public sign-up in v1; see Size.
Date: 2026-10-13

> **Confidence.** Five screens come from the owner's own screenshots
> (`screens/`, not committed). The rest is from public sources via web search;
> teamily.ai itself is blocked by this environment's network policy. Rows
> marked *seen* are from screenshots; *inferred* rows are not.

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | owner's account, 5 screenshots | `replica/screens/` | chat thread, agent directory, automations, memory, artifacts. UI in Traditional Chinese |
| 2 | web app | https://teamily.ai/chat | blocked from this environment |
| 3 | marketing site | https://teamily.ai/ | "always-on agents ... one unified and context-aware space" |
| 4 | about page | https://teamily.ai/about | "+ New Agent", prompt-built agents |
| 5 | pricing | https://teamily.ai/pricing | Free / Plus $19.99 / Premium $99.99 / Pro $199.99 |
| 6 | changelog | https://teamily.ai/changelog | Studio webapp builder, Agent Hub, public agent profiles |
| 7 | help center | https://teamily.ai/about/help-center | not reached |
| 8 | invite page | https://teamily.ai/invite/group/3176557915 | `/invite/group/{id}` |
| 9 | App Store | https://apps.apple.com/us/app/teamily-ai-human-ai-team/id6761445638 | v2.0.8 "Artifacts: Shared Docs, Whiteboard" |
| 10 | Google Play | https://play.google.com/store/apps/details?id=ai.teamily.mobile | |
| 11 | blog: agent teams | https://blog.teamily.ai/teamily-ai-brings-agent-teams-to-human-teams/ | agents as named group members |
| 12 | Forbes | https://www.forbes.com/sites/charliefink/2026/03/06/teamily-ai-brings-agent-teams-to-human-teams/ | tasks split into subtasks, visible plan |
| 13 | launch PR | https://www.businesswire.com/news/home/20260708584390/en/Teamily-AI-Publicly-Launches-HumanAI-Social-Platform-to-Make-Building-and-Growing-a-Company-Easy-for-Every-Team | July 2026 |

## Core loop

You message an agent (or a group of agents and people), it answers in the
thread and produces deliverables (web pages, docs) as cards you can open,
and what it learns is filed into your memory wiki for every later chat.

## App shell (seen, all 5 screenshots)

Left icon rail, top to bottom: logo; Chats; Agents; Automations; Explore
(compass); Memory (brain); Artifacts (layers); Contacts/profile (person).
Bottom: Download apps; Language (globe); plan label "FREE"; Gifts (badge
count); own avatar. Active item has a pale green tile. Accent colour is a
saturated green; surfaces are white and very light grey; cards have large
radius and no visible border.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen | source |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | Sign in / sign up | redirect from `/chat` | account | auth form | none | inferred |
| S02 | Onboarding | first sign-in | seeds starter wiki pages and a "Teamily Agent" friend | | none | inferred from S13 "Getting Started" pages, S03 "you're now friends" |
| S03 | Conversation list | rail: Chats, `/chat` | all chats | search, green "+" (new), promo row at top, Pinned section with count + collapse, Chats section with count + collapse, rows with avatar, name, verified badge, last message preview, day or time | filled, pinned, selected row (green tint) | seen |
| S04 | Chat thread | select a row in S03 | talk to an agent or group | header (avatar, name, Invite, Agent workspace, search, more), doodle wallpaper, own bubble (green, right), agent message with name above, long-message collapse ("show less"), "Demo" tag, artifact card in message, upsell banner (3-day Plus trial, dismiss), composer | filled, long message collapsed/expanded, upsell banner | seen |
| S05 | Composer (part of S04) | bottom of S04 | write and send | multi-line input, expand, attach "+", tools (wrench), connectors (plug), mode select "Instant", prompt-enhance (sparkle), voice wave, scissors (unknown), text format, emoji, mic button | empty | seen |
| S06 | Artifact preview card | inside S04 agent message | open a deliverable inline | title, type badge "WEB", copy link, embedded preview with its own tab nav, expand to full | loaded | seen |
| S07 | Agent workspace | "Agent workspace" button in S04 header | agent's tasks, files and settings for this chat | | none | inferred, needs a screenshot |
| S08 | Agent directory | rail: Agents | browse and start agents | search, "+ Create my agent", top tabs Agents / Agent Teams, source filter "By Teamily AI" / "My agents", category chips (All, Content Creation, Customer Support, Data Analysis, Design, Education, Engineering, Finance, IT & Security, Investment, Legal, Life, Marketing, more), 3-column cards (avatar, name, 2-line description, green "Chat" button) | filled | seen |
| S09 | Agent Teams | tab in S08 | prebuilt multi-agent groups (e.g. "Paid Search & Social", "Ad Creative Studio" in S03) | | none | inferred |
| S10 | Create / edit agent | "+ Create my agent" | name, avatar, prompt, tools | | none | inferred |
| S11 | Automations | rail: Automations | recurring agent jobs from templates | title, search, tabs My automations / Work / Life, 3-column template cards (icon, title, one-line description) | filled (Work tab) | seen |
| S12 | Automation setup | click a template in S11 | pick agent, schedule, inputs | | none | inferred |
| S13 | Memory overview | rail: Memory | personal wiki of everything agents learned | left: search topics, filter All/Updated/Tags, "+ New"; fixed entries Overview, My profile, Next actions, My outputs; pages grouped by topic with collapse (Uncategorized, Getting Started), each page with title, excerpt, time ago, #tags. Main: stats row (nodes, links, unlinked, topics), search, topic chips with counts, graph canvas with zoom/reset, right panel tabs Topic highlights / Recently updated, hint "click to view, double-click to open, hover to preview" | filled (4 pages) | seen |
| S14 | Memory page | double-click a node or a page in S13 | read and edit one wiki page | | none | inferred |
| S15 | Explore | rail: compass | discover public agents or content | | none | inferred, needs a screenshot |
| S16 | Artifacts | rail: Artifacts | everything created or saved | left: title, "+ New" dropdown, search, types Overview / Websites / Docs (docs, slides, PDF) / Photos & video (image, video, audio) / Messages. Main: tabs Recently used / Recently starred, grid/list toggle, notifications bell, filter | empty state with 3 actions: new cloud doc, let an agent build a website, save a chat message (right-click a message, "Add to my Artifacts") | seen |
| S17 | Artifact viewer / editor | open from S06 or S16 | view, edit, share | | none | inferred |
| S18 | Settings / profile | rail: avatar | profile, language, connectors | | none | inferred |
| S19 | Invite | "Invite" in S04, `/invite/group/{id}` | add people to a chat | | none | inferred |

## Flows

```
F01 Chat with an agent from the directory
    S08 -> click "Chat" on a card -> S04 (new chat appears in S03)
    happy path clicks: 2
    edge: agent already in your chats (open existing), category with no agents

F02 Create my own agent
    S08 -> "+ Create my agent" -> S10 -> save -> S04
    happy path clicks: ~4 plus typing
    edge: empty prompt, duplicate name

F03 Ask an agent for a deliverable (the core loop)
    S04: type in S05 -> send -> agent replies with S06 card -> expand -> S17
    happy path clicks: 2 plus typing
    edge: long prompt (collapsed in the thread), generation fails, preview fails to load

F04 Group with several agents
    S03 "+" -> new group -> pick agents (and people) -> S04 with group avatar
    happy path clicks: ~4
    edge: two agents answer at once, mention routing

F05 Set up an automation
    S11 -> pick a template (e.g. "Daily work brief") -> S12 -> save -> appears under "My automations"
    happy path clicks: ~3
    edge: schedule in another time zone, the agent's run fails, pausing

F06 Browse and edit memory
    S13 -> click a node (preview) -> double-click (open S14) -> edit -> save
    happy path clicks: 3
    edge: unlinked pages, deleting a page that others link to, conflicting facts

F07 Save a chat message as an artifact
    S04 -> right-click a message -> "Add to my Artifacts" -> S16 Messages
    happy path clicks: 2
    edge: saving a message twice

F08 Pin a chat
    S03 row menu -> Pin -> row moves to Pinned
    happy path clicks: 2
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Icon rail item | nav, utility (download, language), gift with badge, avatar | default, hover, active (green tile) | all |
| Button | primary pill (green), secondary pill (light grey), icon, round icon (green "+", green mic) | default, hover, disabled | all |
| Search field | pill, large (directory), small (sidebar) | empty, typing | S03, S08, S11, S13, S16 |
| Section header | with count and collapse chevron | open, collapsed | S03, S13 |
| Conversation row | agent, group (stacked avatars), pinned, promo | default, selected, unread | S03 |
| Avatar | agent (illustrated), group stack, with small status badge | | S03, S04, S08 |
| Verified badge | | | S03 |
| Message bubble | own (green), agent (plain, name above) | collapsed, expanded, streaming | S04 |
| Artifact card | web, doc, image | loading, loaded, expanded | S04, S16 |
| Upsell banner | trial offer | shown, dismissed | S04 |
| Composer | | empty, typing, recording | S04 |
| Mode select | "Instant" plus others (unknown) | | S05 |
| Tabs | underline (Agents / Agent Teams, Highlights / Recent), pill (My / Work / Life) | active, inactive | S08, S11, S13, S16 |
| Chip | category filter, topic filter with count | active (green), inactive | S08, S13 |
| Agent card | | default, hover | S08 |
| Template card | icon in pale green circle, title, description | default, hover | S11 |
| Wiki page row | title, excerpt, time ago, #tags | default, selected | S13 |
| Stat | number + label (warning colour for "unlinked") | | S13 |
| Graph canvas | nodes (green = linked, grey = unlinked), edges, zoom controls | idle, hover preview | S13 |
| Empty state | icon, title, text, action rows with green arrow button | | S16 |
| View toggle | grid / list | | S16 |

## Inferred data model

```
User         id, name, avatar_url, locale, plan, created_at
             evidence: S18 rail avatar, "FREE" label, language button
             confidence: high

Agent        id, owner_id (null = built-in), name, avatar_url, description,
             category, system_prompt, model, tools[], connectors[],
             is_public, verified
             evidence: S08 cards and categories, "By Teamily AI" / "My agents",
             S03 verified badge, S05 tools and connectors buttons
             confidence: high (fields shown) / guess (prompt, tools)

AgentTeam    id, name, description, agent_ids[]
             evidence: S08 "Agent Teams" tab, S03 group chats of agents
             confidence: medium

Conversation id, kind (dm | group), title, avatar, pinned, last_message_at
             evidence: S03 pinned section, previews, times
             confidence: high

Member       conversation_id, member_type (user | agent), member_id, role
             evidence: S03 group avatars, S04 Invite button
             confidence: high

Message      id, conversation_id, sender_type, sender_id, body (markdown),
             attachments, artifact_id, mode ("Instant" ...), created_at
             evidence: S04, S05
             confidence: high

Artifact     id, owner_id, kind (website | doc | slides | pdf | image | video |
             audio | message), title, content or url, source_message_id,
             starred, last_opened_at
             evidence: S16 types, tabs, empty-state actions; S06 card
             confidence: high

WikiPage     id, owner_id, title, body (markdown), topic, tags[],
             updated_at, created_by (user | agent)
             evidence: S13 rows, topics, tags, "time ago"
             confidence: high

WikiLink     from_page_id, to_page_id
             evidence: S13 graph edges, "links" and "unlinked" stats
             confidence: high

Automation   id, owner_id, template_id, agent_id, name, schedule (cron),
             inputs (json), status (active | paused), last_run_at
             evidence: S11 templates and "My automations"
             confidence: medium (schedule fields are a guess)

AutomationRun id, automation_id, started_at, status, output_message_id
             confidence: guess
```

Relationships: User 1-n Agent; AgentTeam n-n Agent; Conversation n-n
(User | Agent) via Member; Conversation 1-n Message; Message 0-1 Artifact;
User 1-n WikiPage; WikiPage n-n WikiPage via WikiLink; User 1-n Automation;
Automation 1-n AutomationRun.

## Feature matrix

See `features.csv`. Must: 13, should: 12, could: 9, skip: 6.

## Out of scope (cannot or should not be cloned)

- Teamily's name, logo, mascot, agent illustrations, chat wallpaper and copy.
  Draw or generate your own.
- Its built-in agent catalogue as content (write your own agents and prompts).
- Its users, public agents, partner connectors, model deals.
- Billing, plans, trials, gifts and upsells: not needed for a tool only you
  use.
- Calls, meetings, office suite, Agent Hub, mobile and desktop apps.

## Size

Screens 19 (10 seen), flows 8, entities 11.
Hard parts:
1. Agents that produce real deliverables (a web page with a live preview)
   and show them as cards in the chat.
2. Memory: agents writing and updating linked wiki pages from conversations
   without duplicating or contradicting themselves, plus the graph view.
3. Automations: a scheduler that runs an agent on a timer and posts the
   result back into a chat.
For one owner it is much smaller than the public product: no multi-tenant
access rules, no billing, no invite system. Size: **M** (a few weeks) for
chat + directory + memory + artifacts; automations add a week or two.

## Gaps to close

1. Screenshots still useful: S07 Agent workspace, S10 Create agent form,
   S12 an automation's setup, S14 a memory page open, S15 Explore, the "+"
   menu in S03, and the "Instant" mode dropdown.
2. Check Teamily's terms of service for any ban on using your account to
   build a competing tool (less of a concern for a private tool, but check).
