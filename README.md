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

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/twitter/     # Twitter OAuth endpoints
│   │   └── stripe/           # Stripe Identity endpoints
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── twitter.ts            # Twitter API client
│   └── stripe.ts             # Stripe client
└── types/
    └── index.ts
```

## License

Private - HDA-OC
