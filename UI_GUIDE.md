# Winky CRM Assistant - UI Guide

## Color Palette
- **Primary**: `#fcedf2` (Soft Pink) - Action buttons, highlights, important alerts
- **Secondary**: `#e4f2fc` (Soft Blue) - Cards, borders, secondary actions
- **Grays**: Text hierarchy in 900 (darkest) → 600 (medium) → 100 (lightest)

## Page Layouts

### 1. Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome, Winky! 👋                           💬 Inbox [9+]   │
│ 5 customers to follow up with today                          │
└─────────────────────────────────────────────────────────────┘
                          
┌──────────┬──────────┬──────────┬──────────┐
│ 👥 5     │ 📋 3     │ 💬 2     │ 📞 4     │
│ Total    │ Today's  │ Unread   │ Active   │
│ Customers│ Follow-  │ Messages │ Convs    │
│          │ ups      │          │          │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────┐
│ Messages by Channel                      │
├─────────────────────────────────────────┤
│ 💬 WhatsApp: 2  │  🔐 WeChat: 1  │  📧 Email: 1 │
└─────────────────────────────────────────┘

╔═════════════════════════════════════════╗
║ 🔴 Urgent Follow-ups                [1] ║
╠═════════════════════════════════════════╣
║ ► 🔐 Lisa Wong                          ║
║   High interest - needs layout drawing  ║
║   [WeChat] [1d ago]                     ║
║                                         ║
║   If expanded:                          ║
║   ├─ Suggested Action: Check in about  ║
║   │  the bedroom furniture              ║
║   ├─ ✨ AI-Suggested Message: Generate │
║   ├─ 📨 Open Chat | ✓ Mark Done       ║
║   └─ [💡 Tap to see AI suggestion]    ║
╚═════════════════════════════════════════╝

╔═════════════════════════════════════════╗
║ 🟡 Regular Follow-ups                [2] ║
╠═════════════════════════════════════════╣
║ ► 💬 Sarah Johnson                      ║
║   Potential customer - needs nurturing  ║
║   [Email] [5d ago]                      ║
║                                         ║
║ ► 🔐 Liu Ming                           ║
║   Delivery follow-up needed             ║
║   [WeChat] [45d ago]                    ║
╚═════════════════════════════════════════╝
```

### 2. Unified Inbox (`/inbox`)

```
┌──────────────────────────────────────────────────────────────┐
│ 💬 Unified Inbox                    ← Back to Dashboard      │
│ Email • WhatsApp • WeChat                                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┬────────────────────────────────────────┐
│ CONVERSATION     │ CHAT WINDOW                            │
│ LIST (sidebar)   │                                        │
│                  │ Header:                                │
│ Search bar       │ 🔐 Lisa Wong                          │
│                  │ WeChat • 中文                          │
│ [unread: 2]      │                                        │
│                  │ [Messages...]                          │
│ 🔐 Lisa Wong ❤️ 2│ Customer:                              │
│   Wants bedroom  │ "嗨，昨天看的床很喜欢。今天可以发给我│
│   layout drawing │  房间平面图吗？"                        │
│   12h ago        │ [12h ago]                              │
│                  │                                        │
│ 💬 Sarah J...    │ Winky:                                 │
│   Building house │ "好的！我稍后给您发送详细尺寸和布置   │
│   5d ago         │  效果图。"                              │
│                  │ [2d ago]                               │
│ 📧 Chen Wei      │                                        │
│   Office chairs  │ [Input area with message draft         │
│   8d ago         │  suggestions below...]                 │
│                  │                                        │
│ 🔐 Liu Ming      │ AI Suggestions (Expandable):           │
│   ...            │ ─────────────────────────────          │
│                  │ ✨ Generate Reply Draft                │
│                  │ [Generates message based on           │
│                  │  customer's last message,             │
│                  │  their status, language, channel]     │
│                  │                                        │
│                  │ [📋 Copy Draft] [✕ Clear]             │
│                  │                                        │
│                  │ 💡 AI generates context-aware         │
│                  │ replies considering customer's        │
│                  │ status, language, and channel         │
└──────────────────┴────────────────────────────────────────┘
```

## Component Details

### Follow-Up Card (Expanded)
```
╔═════════════════════════════════════════╗
║ 🔐 Lisa Wong                        ▼   ║
║ High interest - needs layout drawing    ║
║ [WeChat] [1d ago]                       ║
╠═════════════════════════════════════════╣
║                                         ║
║ Suggested Action:                       ║
║ Check in with Lisa Wong about their     ║
║ furniture purchase                      ║
║                                         ║
║ ✨ AI-Suggested Message:                ║
║ [Generate] (or if already generated)    ║
║                                         ║
║ ┌─────────────────────────────────┐    ║
║ │ 嗨Lisa！昨天看的床感觉怎么样？  │    ║
║ │ 我今天可以给你发一下房间的     │    ║
║ │ 平面图，帮助你更好地规划房间   │    ║
║ │ 布局。你有时间讨论一下吗？      │    ║
║ └─────────────────────────────────┘    ║
║                                         ║
║ [📋 Copy Message] [✕ Clear]            ║
║                                         ║
║ [📨 Open Chat] [✓ Mark Done]           ║
║                                         ║
╚═════════════════════════════════════════╝
```

### Chat Message Timeline
```
─ Jun 30, 2024 ─

Customer:
┌────────────────────────────┐
│ 你好，我对你们的餐桌很感 │
│ 兴趣。能给我发一下尺寸吗？│
└────────────────────────────┘
                      2 days ago

Winky:
                   ┌────────────────────────────┐
                   │ 好的！我稍后给您发送详细 │
                   │ 尺寸和布置效果图。         │
                   └────────────────────────────┘
                                    48 hours ago

─ Jul 1, 2026 ─

Customer:
┌────────────────────────────┐
│ 嗨，昨天看的床很喜欢。    │
│ 今天可以发给我房间平面图吗│
└────────────────────────────┘
                      12h ago
```

## Interactive Elements

### Buttons & States

**Primary Action** (Pink #fcedf2)
```
Default:  [  Generate Reply  ]
Hover:    [  Generate Reply  ] (darker pink)
Active:   [  ⏳ Generating...  ] (disabled, spinner)
Done:     [  📋 Copy Draft    ] (success state)
```

**Secondary Action** (Blue #e4f2fc)
```
Default:  [  📨 Open Chat  ]
Hover:    [  📨 Open Chat  ] (darker blue)
```

**Unread Badge** (Red)
```
Position: Top-right of conversation item
Style:   🔴 White text on red circle
Content: "2" or "9+" if > 9 unread
```

### Loading States
```
Dashboard Loading:
┌─────────────────┐
│      ⟲          │
│ Loading your    │
│ dashboard...    │
└─────────────────┘

Chat Loading (when generating AI message):
─ Spinner: ⟲ (animated circular border)
─ Text: "Generating message..."
```

## Responsive Breakpoints

### Mobile (<768px)
- Conversation list hidden by default
- Tap conversation → full-screen chat
- No sidebar visible
- Stack order: Header → Chat/List → Input

### Tablet (768px-1024px)
- Split view (1/3 list, 2/3 chat)
- Conversation list always visible
- Dashboard cards in 2-column grid

### Desktop (1024px+)
- Full three-section layout
- Dashboard cards in 4-column grid
- Optimal spacing and padding throughout

## Typography

```
Page Title:        32px, Bold (#171717)
Section Heading:   20px, Bold (#171717)
Card Title:        18px, Bold (#171717)
Body Text:         14px, Regular (#555555)
Caption:           12px, Regular (#888888)
Button Text:       14px, Medium (#171717)
```

## Spacing System

```
xs: 4px   - Between inline elements
sm: 8px   - Small gaps
md: 16px  - Standard padding
lg: 24px  - Section padding
xl: 32px  - Major sections
```

## Interactive Behavior

### Dashboard Card Hover
- Slight scale up (105% for high-priority)
- Background color shift
- Smooth transition (200ms)

### Follow-Up Card Expand/Collapse
- Smooth height animation
- Background color transition
- AI message generation on expand
- Copy to clipboard with confirmation

### Inbox Search
- Real-time filtering
- Case-insensitive matching
- Highlights matching customers

## Accessibility

- ✓ Color contrast ratio 4.5:1 for text
- ✓ ARIA labels on interactive elements
- ✓ Keyboard navigation support
- ✓ Loading states with text (not just icons)
- ✓ Focus indicators on buttons
- ✓ Mobile-friendly tap targets (min 44px)

---

This UI is designed to be intuitive for a busy salesperson who needs quick access to follow-ups and conversation history while leveraging AI to save time on message composition.
