# 🔐 Secrets & Environment Variables Guide

## ⚠️ Security Rules

**NEVER commit these files to GitHub:**
- `.env.local`
- `.env.*.local`
- Any file containing API keys, secrets, or tokens

**ALWAYS protect:**
- Supabase service role keys
- Stripe secret keys
- OAuth secrets
- Database passwords
- Any sensitive credentials

## 📋 Git Protection Setup

Your `.gitignore` is configured to prevent accidental commits of:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local
```

Verify this is working: All `.env.local*` files will be ignored by git.

## 🚀 Setup Workflow

### 1. Create Local Environment File
```bash
# Copy the template
cp .env.example .env.local

# Edit with your actual credentials (NEVER commit this)
nano .env.local
```

### 2. Get Your Credentials

#### From Supabase:
1. Go to your project in https://supabase.com
2. Project Settings → API
3. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Copy the API URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Copy the `anon` public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Copy the `service_role` secret key

#### From Stripe:
1. Go to https://dashboard.stripe.com
2. Developers → API Keys
3. Copy these values:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Copy the publishable key
   - `STRIPE_SECRET_KEY` - Copy the secret key
4. Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Copy `STRIPE_WEBHOOK_SECRET`

### 3. Update `.env.local`
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=stripe_webhook_secret_here
```

### 4. Restart Development Server
```bash
npm run dev
```

## 🏭 Production Deployment

### On Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. Redeploy

**Note:** Public variables start with `NEXT_PUBLIC_` (safe to expose). Secret variables don't (hidden from client).

## 🔍 Verify Protection

### Check if files are ignored:
```bash
# This should show nothing (files are ignored)
git status --ignored

# This should show it's in .gitignore:
git check-ignore .env.local
```

### Before committing, verify:
```bash
# Look for secrets in staged files
git diff --cached | grep -i "secret\|key\|token"

# Should return nothing if you're safe
```

## 📚 Environment Variables Explained

| Variable | Purpose | Public? | Example |
|----------|---------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API endpoint | ✅ YES | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public auth key | ✅ YES | `supabase_anon_key_here` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (server-only) | ❌ NO | `supabase_service_role_key_here` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ✅ YES | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe admin key | ❌ NO | `stripe_secret_key_here` |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | ❌ NO | `stripe_webhook_secret_here` |

## ⏰ Emergency: Secrets Exposed?

If you accidentally commit a secret key:

### Immediate Actions:
1. **Revoke the key immediately** in Supabase/Stripe dashboard
2. **Generate a new key**
3. **Update `.env.local` with new key**
4. **Remove from git history** (see below)

### Remove from Git History:
```bash
# Install git-filter-repo if needed
pip install git-filter-repo

# Remove file from all history
git filter-repo --invert-paths --path .env.local

# Force push (risky - only if not public yet)
git push origin --force-all
```

**Better:** Just revoke the old key and generate a new one. Don't expose a key by trying to hide it.

## 🎯 Best Practices

✅ **DO:**
- Use `.env.example` for templates
- Keep `.env.local` in `.gitignore` (Already done!)
- Rotate keys regularly
- Use different keys for dev/prod
- Document which keys are needed
- Store secrets in Vercel environment variables
- Use descriptive names for keys

❌ **DON'T:**
- Commit `.env.local` or any `.env*` files
- Share secrets in Slack, email, or chat
- Use test keys in production
- Hardcode secrets in code files
- Push to GitHub if secrets are exposed
- Use same keys across environments

## 🔄 Key Rotation Schedule

Recommended rotation:
- **API Keys**: Every 3 months
- **Webhook Secrets**: Every 6 months
- **OAuth Tokens**: As needed per provider
- **After security incident**: Immediately

## 📞 Quick Reference

```bash
# View your exposed variables (should be none)
git log -p -- .env.local 2>/dev/null | head -50

# Check what's in staging
git diff --cached

# Test local setup works
npm run dev
# Visit http://localhost:3000 and test auth
```

## ✨ You're Secure!

Your project is now configured with:
- ✅ Proper `.gitignore` setup
- ✅ Environment variable templates
- ✅ Secret protection
- ✅ Ready for safe deployment

**Next:** Fill in your actual credentials in `.env.local` and start Phase 3! 🚀
