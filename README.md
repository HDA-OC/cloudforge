# CloudForge

MVP for Twitter OAuth 2.0 authentication with Stripe Identity verification.

## Overview

CloudForge provides a verification flow that:
1. Authenticates users via Twitter OAuth 2.0
2. Verifies their identity through Stripe Identity
3. Links verified identities to Twitter accounts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Twitter OAuth 2.0 with PKCE
- **Identity Verification**: Stripe Identity
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
cloudforge/
├── .state/                    # Agent state tracking
│   ├── CURRENT.md             # What's happening NOW
│   ├── SPRINT.md              # Current sprint tasks
│   ├── BACKLOG.md             # Future work queue
│   └── decisions/             # Architecture Decision Records
│
├── knowledge/                 # Accumulated project knowledge
│   ├── architecture/          # System design docs
│   ├── patterns/              # Code conventions
│   ├── tools/                 # Tool-specific guides
│   └── workflows/             # Process documentation
│
├── docs/                      # User-facing documentation
├── research/                  # Research & exploration
│
└── src/                       # Application source code
    └── app/
        ├── api/
        │   ├── auth/twitter/  # Twitter OAuth endpoints
        │   └── stripe/        # Stripe Identity endpoints
        ├── layout.tsx
        └── page.tsx
```

## For Agents

This repo uses a state management pattern for agent-driven development:

1. **Start** by reading `.state/CURRENT.md` — What's happening?
2. **Work** on tasks from `.state/SPRINT.md` — What should I do?
3. **Decide** using `.state/decisions/` — Record significant choices
4. **Learn** from `knowledge/` — Established patterns

Update `.state/CURRENT.md` at the start and end of every session.

## Environment Variables

```env
# Twitter OAuth 2.0
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_CALLBACK_URL=http://localhost:3000/api/auth/twitter/callback

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## License

Private - HDA-OC
