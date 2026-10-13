# Components

Every component reads tokens only (`bg-surface`, `text-muted`, `rounded-lg`),
never raw hex. Sizes are CSS px at 1x. Accessible base: Radix primitives via
shadcn/ui for dialog, menu, select, tabs, tooltip, toast. Icons: Lucide (ISC
licence), 20px in the rail and toolbars, 16px inline. Copy is written fresh;
none of Teamily's labels are reused.

Focus everywhere: `focus-visible` 2px ring in `focus`, 2px offset. Nothing
removes the outline without replacing it. Every interactive part is at least
32px tall (40px on touch).

## Shell

```
Icon rail (S03-S16, every screen)
  layout    fixed left, width rail (64), bg, right border; top: logo; nav: Chats, Agents,
            Automations, Explore, Memory, Artifacts, Contacts; bottom: Download, Language,
            plan label, Gifts, avatar
  item      40x40 button, icon 20, radius md
  states    default text-muted; hover bg-control text-fg; active bg-accent-soft text-accent-text;
            focus-visible ring; badge (count) top-right, bg-danger text-white xs
  a11y      <nav aria-label="Main">, each item a link with aria-label and aria-current="page"
            when active; tooltip with the label on hover/focus
  mobile    becomes a bottom tab bar under md (5 items + More)

Header bar (S04)
  layout    height header (56), bg, bottom border, padding-x 16
  parts     avatar 36 + title base/600 (truncate), right: secondary pills, icon buttons
  a11y      title is the page <h1>
```

## Inputs and actions

```
Button
  variants  primary (bg-accent text-on-accent), secondary (bg-control text-fg),
            ghost (transparent, text-secondary), danger (bg-danger text-white),
            icon (square), fab (round 40, primary)
  sizes     sm 32 / px 12 / text sm, md 40 / px 16 / text sm 600, lg 48 / px 20 / text base 600
  shape     radius pill for text buttons (seen), radius md for icon buttons
  states    default, hover (accent-hover / control-hover), active (translateY 1px),
            focus-visible ring, disabled (opacity .5, no pointer), loading (spinner replaces
            leading icon, label stays, aria-busy)
  a11y      real <button>; icon-only needs aria-label; loading keeps the label readable
  used on   S03 "+", S04 header, S06, S08 "Chat" and "Create", S11, S13, S16

Search field
  variants  sm (sidebar, height 40), lg (page, height 48)
  tokens    bg-control, radius pill, leading search icon 16 text-muted, placeholder text-muted
  states    empty, typing (clear button appears), focus-visible ring, loading (spinner)
  a11y      <input type="search"> with a visible or aria label; Esc clears
  used on   S03, S08, S11, S13, S16

Text input / textarea
  tokens    bg, 1px border-input, radius md, height 40, px 12, text base
  states    default, hover (border text-muted), focus (ring), disabled, error (border danger
            + message text-sm danger, aria-invalid, aria-describedby)
  used on   S10, S12, S14, S18

Select / mode select
  tokens    ghost button with chevron, text-muted sm; menu = Popover
  a11y      Radix Select; arrow keys, typeahead
  used on   S05 model mode, S10 model and effort, S12 schedule

Chip (filter)
  variants  category chip, topic chip with count + coloured dot
  size      height 40, px 16, radius pill, text sm 500
  states    inactive bg-control text-secondary; hover bg-control-hover; active bg-accent
            text-on-accent (category) or bg-accent-soft text-accent-text (topic); focus ring
  a11y      a group of toggle buttons with aria-pressed, or a radiogroup when single-select;
            horizontal scroll with a "more" arrow button on overflow
  used on   S08, S13

Tabs
  variants  underline (S08 Agents / Agent Teams, S13, S16), pill (S11 My / Work / Life)
  states    active text-fg 600 + 2px accent underline / bg-accent text-on-accent pill;
            inactive text-muted; hover text-fg; focus ring
  a11y      Radix Tabs: role=tablist, arrow keys move, Home/End
  used on   S08, S11, S13, S16

View toggle (grid / list)
  a11y      two toggle buttons, aria-pressed
  used on   S16
```

## Lists and cards

```
Section header (collapsible)
  parts     icon 14 + label xs/500 text-muted + count + chevron
  states    open, collapsed (chevron rotates -90deg, motion fast)
  a11y      <button aria-expanded aria-controls>
  used on   S03 Pinned / Chats, S13 topics

Conversation row
  layout    height 80, px 16, gap 12; avatar 48; name base/600 truncate; preview sm text-muted
            one line; time xs text-muted right
  variants  agent, group (stacked avatars), pinned, verified (badge after name)
  states    default; hover bg-control; selected bg-accent-soft + 1px accent-soft border,
            radius lg; unread (name 700 + count badge); typing (preview shows "typing…" in accent-text)
  a11y      a link in a <ul>; arrow up/down moves between rows; selected uses aria-current
  used on   S03

Avatar
  sizes     24, 32, 36, 48
  variants  image, initials on a tint, agent (rounded square radius md to tell agents from
            people), group stack (2-4 overlapping, 2px bg ring)
  badge     small status dot or agent mark, bottom-right
  a11y      decorative when next to a visible name (alt=""), else alt=name
  used on   S03, S04, S08

Agent card
  layout    bg, radius lg, shadow card, padding 20, gap 16; avatar 64 on a tint circle;
            title base/600; description sm text-muted, 2-line clamp; primary sm "Chat" button
  states    default, hover (shadow raised), focus-within ring
  grid      auto-fill minmax(card-min 320, 1fr), gap grid-gap 24; 1 column under sm
  a11y      card is an <article>; the button is the only control, labelled "Chat with {name}"
  used on   S08

Template card (automation)
  layout    bg, radius lg, padding 24; icon 20 in a 40 circle bg-accent-soft text-accent-text;
            title base/600; description sm text-muted
  states    default, hover (shadow raised), focus ring; the whole card is the button
  used on   S11

Wiki page row
  parts     doc icon 16 in a 32 circle bg-control; title base/500; excerpt sm text-muted 1 line;
            meta xs text-muted: time ago + #tags
  states    default, hover bg-control, selected bg-accent-soft
  used on   S13

Nav list item (side panel)
  parts     icon in a 40 tint circle; title base/600; subtitle xs text-muted
  states    default, hover bg-control, selected bg-accent-soft
  used on   S13 Overview / My profile / Next actions / My outputs, S16 type nav

Stat
  parts     number xl/700 text-fg (warning colour for "needs attention"), label xs text-muted
  a11y      a <dl>: number in <dd>, label in <dt>
  used on   S13
```

## Chat

```
Message bubble
  variants  own (right, bg-bubble-own, radius lg with the bottom-right corner sm),
            agent (left, name sm/600 above, avatar 32, plain bg or bg on thread-bg),
            system (centered xs text-muted)
  max width bubble-max (72ch)
  states    sending (opacity .7), sent, failed (danger icon + "Retry" ghost button),
            streaming (blinking caret, aria-live="polite" region updated in batches),
            collapsed (over 12 lines: fade + "Show more" / "Show less" ghost button)
  content   markdown: paragraphs, lists, code blocks (mono, bg-control, radius md),
            links accent; images open in a dialog
  a11y      thread is a role="log" list; each message an <article> with the sender name
  used on   S04

Plan card (agent run, S06)
  parts     header: agent name + status pill; steps list (icon pending/running/done/failed
            + title sm); footer: elapsed time, Cancel ghost button
  states    queued, running (spinner on the current step), done (collapses to one line,
            expandable), failed (danger-soft bg, error text), cancelled
  a11y      status changes announced through aria-live="polite"; Cancel is a real button
  used on   S04

Artifact card (S06)
  parts     header bg-tint-cyan-bg: kind icon + title base/600 truncate + kind badge
            (xs/600, radius pill, tint fg on tint bg) + copy-link icon button;
            preview area 16:9 (sandboxed iframe, pointer-events off), expand icon button
  states    generating (skeleton), ready, failed (danger message + retry), hover (shadow raised)
  a11y      the title is a link to the viewer; iframe has title and is aria-hidden in the card
  used on   S04, S16

Composer (S05)
  layout    bg, radius xl, shadow raised, margin 16, min height composer-min (104);
            auto-growing textarea (max 40% of viewport, then scroll); toolbar row below:
            left attach / tools / connectors; right mode select, voice, emoji, send
  send      fab 40: mic when empty, arrow-up send when there is text
  states    empty, typing, @mention open, uploading (file chips with progress), recording
            (waveform + stop), disabled (agent busy is NOT a reason: you can queue messages)
  keys      Enter sends, Shift+Enter new line, Cmd/Ctrl+K focuses search, Esc closes menus
  a11y      textarea labelled "Message {chat name}"; toolbar is role="toolbar" with roving focus
  used on   S04

Mention picker
  parts     popover above the caret, list of agents (avatar 24 + name) filtered by typed text
  a11y      combobox pattern: aria-activedescendant, arrow keys, Enter picks, Esc closes
  used on   S04 groups

Notice banner (replaces the original's upsell)
  parts     dot + text sm + action button sm + dismiss icon
  use       system notices only (e.g. "Automation failed"); no upsells in a private tool
  a11y      role="status"; dismiss remembers per notice
```

## Overlays and feedback

```
Dialog
  tokens    bg, radius lg, shadow pop, padding 24, max width 480 (sm) / 720 (lg); scrim
            rgba(15,23,42,.4)
  a11y      Radix Dialog: focus trap, Esc closes, focus returns to the trigger, aria-labelledby
  used on   S07 new group, S10 on mobile, confirm deletes

Menu / popover
  tokens    bg, radius md, shadow pop, padding 4; items height 36, px 12, radius sm,
            hover bg-control; danger items text-danger
  a11y      Radix DropdownMenu: arrow keys, typeahead, Esc
  used on   S03 "+", row menus (pin, delete), S04 "more", S16 "+ New"

Toast
  variants  info, success, error (left 3px bar in the role colour)
  a11y      Radix Toast, role="status" (error: role="alert"), pause on hover, 5s
  used on   saves, copy link, failures

Tooltip
  tokens    bg-fg text-bg xs, radius sm, padding 4/8, delay 400ms
  used on   rail items, icon buttons

Empty state
  parts     icon 24 in a 64 circle bg-control; title xl/700; text sm text-secondary;
            up to 3 action rows (tint icon circle + title base/600 + text sm text-muted +
            round primary arrow button), max width 600, centered
  used on   S16, S03 (no chats yet), S11 My automations, S13 (no pages)

Skeleton
  tokens    bg-control, radius sm, shimmer motion base (off under prefers-reduced-motion)
  used on   lists and cards while loading

Graph canvas (S13)
  parts     nodes 12 (graph-node linked, graph-node-unlinked otherwise) with a label sm;
            edges 1px border; zoom in / out / reset buttons bottom-right; hover preview
            card (popover)
  a11y      the graph is a visual extra: the page list next to it is the accessible
            equivalent, and the canvas is aria-hidden with the controls still focusable
  used on   S13
```

## Motion

`fast` (120ms) for hover and press, `base` (200ms) for panels, collapses and
toasts, `ease` for all. Under `prefers-reduced-motion: reduce`, transitions
drop to opacity only and the shimmer and caret blink stop.
