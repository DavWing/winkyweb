# 🪑 Winky CRM Assistant

A personal AI-powered CRM assistant webapp for furniture salespeople. Unify your communication across email, WhatsApp, and WeChat with intelligent follow-up suggestions and AI-drafted messages.

## 🎯 Features

### Dashboard
- **Daily Overview**: See at a glance who needs follow-up today
- **Priority Sorting**: Customers sorted by urgency (hot → warm → cold)
- **Quick Stats**: Track total customers, unread messages, and active conversations
- **Channel Distribution**: Visual breakdown of messages by platform

### Unified Inbox
- **Multi-Channel Support**: Email, WhatsApp, WeChat all in one place
- **Conversation Timeline**: Complete message history with customers
- **Unread Badges**: Never miss an important message
- **Responsive Design**: Works seamlessly on desktop and mobile

### AI-Powered Suggestions
- **Context-Aware Drafts**: AI generates replies based on customer status, language, and channel
- **Follow-Up Recommendations**: Smart suggestions for when and how to reach out
- **Multi-Language**: Support for English and Chinese

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```
Add your Anthropic API key to `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## 🎨 Design

- **Primary Color**: #fcedf2 (Soft Pink)
- **Secondary Color**: #e4f2fc (Soft Blue)
- **Responsive**: Mobile-first design

## 🤖 AI Features

- Smart reply suggestions based on customer context
- Follow-up message generation
- Language-aware communication
- Channel-specific formatting

## 📱 Pages

- `/` - Dashboard with daily follow-ups
- `/inbox` - Unified conversation inbox

## 🛠️ Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Anthropic Claude API

## 📝 Environment

```
ANTHROPIC_API_KEY=your_api_key_here
```
