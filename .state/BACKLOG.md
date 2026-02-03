# Backlog

## High Priority

- [ ] **CF-002** Twitter OAuth 2.0 implementation
  - Complete the OAuth flow with PKCE
  - Handle callback and token storage
  - Dependencies: None

- [ ] **CF-003** Stripe Identity integration
  - Create verification sessions
  - Handle webhook callbacks
  - Store verification status
  - Dependencies: CF-002

- [ ] **CF-004** Database schema design
  - User table
  - Verification records
  - OAuth tokens
  - Dependencies: None

## Medium Priority

- [ ] **CF-005** Error handling & logging
  - Structured error responses
  - Request logging
  - Error tracking integration

- [ ] **CF-006** Rate limiting
  - Protect auth endpoints
  - Stripe webhook verification

- [ ] **CF-007** Testing setup
  - Unit tests for auth flow
  - Integration tests for Stripe
  - E2E tests for full flow

## Low Priority / Ideas

- [ ] Admin dashboard for verification status
- [ ] Email notifications on verification
- [ ] Analytics and monitoring
- [ ] Multi-provider OAuth (Google, Discord)

## Icebox

- Mobile app support (revisit later)
- API for third-party integrations
- Batch verification processing
