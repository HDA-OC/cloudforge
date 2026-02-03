# What I Need From HD

When you're back at your computer, here's what I need to finish the MVP:

---

## 1. Cloudflare Account (for permanent domain)

**Time needed:** ~10 minutes

1. Create free account at cloudflare.com
2. Add cloudforgeai.com → Cloudflare gives you nameservers
3. Update Squarespace to use Cloudflare nameservers
4. Tell me when done — I'll create the permanent tunnel

**Why:** Current tunnel URL changes on restart. Permanent tunnel = cloudforgeai.com works reliably from your Mac.

---

## 2. Stripe Account + Identity Enabled

**Time needed:** ~15 minutes

1. Create Stripe account (if you don't have one)
2. Go to Settings → Identity → Enable
3. Accept Identity terms of service
4. Go to Developers → API Keys → Copy:
   - Secret key (sk_test_...)
   - Publishable key (pk_test_...)
5. Go to Developers → Webhooks → Add endpoint:
   - URL: `https://cloudforgeai.com/api/stripe/webhook`
   - Events: `identity.verification_session.*`
   - Copy webhook secret (whsec_...)

**Give me:** The three keys (I'll add to .env.local, never commit)

**Why:** Stripe Identity is the core product. Can't test real verification without keys.

---

## 3. Hostinger VPS (Future, Not Blocking)

When ready for production:
- KVM 2 plan (~$10/mo)
- 2 vCPU, 8GB RAM, 100GB NVMe
- Ubuntu 22.04 LTS
- US West location

I'll SSH in and set up everything.

---

## What's Already Done

✅ Local PostgreSQL with full schema
✅ Waitlist API working (emails → database)
✅ Cloudflare Tunnel (temporary URL)
✅ Stripe Identity integration (UI + backend)
✅ Verification flow pages (/verify, /verify/complete)
✅ Agents directory (/agents)
✅ All committed to GitHub

Just need the keys to go live.
