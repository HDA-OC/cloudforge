# Architecture

System architecture documentation for CloudForge.

## Current Architecture

CloudForge is a Next.js 14 application using the App Router pattern.

### Components

- **Frontend:** React (via Next.js)
- **API:** Next.js API routes (App Router)
- **Auth:** Twitter OAuth 2.0 with PKCE
- **Identity:** Stripe Identity for verification
- **Database:** TBD (PostgreSQL planned)

### Data Flow

```
User → Twitter OAuth → CloudForge → Stripe Identity → Verified User
```

## Files in this directory

(Add architecture documents as the system grows)
