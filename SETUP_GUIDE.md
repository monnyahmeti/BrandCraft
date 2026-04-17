# BrandCraft Setup Guide

## Prerequisites
- Node.js 18+
- npm or pnpm
- A Supabase account (https://supabase.com)
- A Stripe account (for Phase 4)

## Initial Setup

### 1. Clone & Install
```bash
cd BrandCraft
npm install
```

### 2. Set Up Supabase

#### Create a New Supabase Project
1. Go to https://supabase.com and sign in
2. Create a new project (select your region)
3. Wait for the database to initialize
4. Go to **Project Settings → API** to find your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - The API URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - The public anon key

#### Initialize the Database Schema
1. In Supabase, go to **SQL Editor**
2. Open a new query and paste the contents of:
   ```
   database/migrations/001_initial_schema.sql
   ```
3. Run the query to create all tables and RLS policies

#### Create a Service Role Key
1. Go to **Project Settings → API**
2. Copy the `service_role` key (use with caution - only for server)
3. This will be your `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (optional, needed for Phase 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

## Architecture Overview

### Multi-Tenancy Model
- **Shared Database, Shared Schema**: All tenant data in same tables with `tenant_id` discriminator
- **Row-Level Security (RLS)**: PostgreSQL policies enforce tenant isolation at database level
- **Tenant Switching**: Client-side context allows users to switch between their brands

### Authentication Flow
1. User signs up with email/password
2. Supabase Auth creates user record
3. User redirected to `/onboarding` to create first brand (tenant)
4. Creating a tenant:
   - Inserts row in `tenants` table
   - Adds user as `admin` in `tenant_members`
5. Redirects to `/dashboard/[brand-slug]`

### Database Schema Highlights

**Tenants Table** - Represents each brand/workspace
- `id`, `name`, `slug`, `owner_id`, `plan_type`, `stripe_customer_id`

**Tenant Members Table** - User access control
- Defines which users belong to which tenants
- Roles: `admin`, `editor`, `viewer`

**Brand Assets Table** - Colors, fonts, logos
- Types: `color`, `typography`, `logo`, `image`
- Stores metadata and references to storage files

**Projects Table** - Collections of assets
- Organize assets into projects
- Collaboration tracking

**RLS Policies** - Enforce tenant isolation
```sql
-- Example: Users can only see data from tenants they're members of
SELECT * FROM brand_assets 
WHERE tenant_id IN (
  SELECT tenant_id FROM tenant_members 
  WHERE user_id = auth.uid()
)
```

## Project Structure

```
src/
  app/
    auth/              # Authentication pages (signup, signin, callback)
    dashboard/         # Main dashboard layout and pages
      [slug]/
        assets/        # Brand assets management
        projects/      # Projects management
        settings/      # Tenant settings
    actions/           # Server actions (mutations)
    api/               # API routes (future)
  lib/
    supabase/          # Supabase client utilities
    context/           # React context providers
    types/             # TypeScript type definitions
```

## Development Workflow

### Adding Features
1. Define server actions in `/src/app/actions/`
2. Create client components that call the server actions
3. Use `useTenant()` hook to access active tenant context
4. Update database schema in `/database/migrations/` if needed

### Creating New Pages
```typescript
// app/dashboard/[slug]/example/page.tsx
'use client'

import { useTenant } from '@/lib/context/TenantContext'

export default function ExamplePage() {
  const { activeTenant } = useTenant()
  
  return <div>Example page for {activeTenant?.name}</div>
}
```

## Testing Locally

### Test User Flow
1. Sign up with a test email
2. Create a brand/tenant
3. Switch between tenants (if you have multiple)
4. Verify RLS by checking database shows correct data isolation

### Test Database Security
```sql
-- As service role in Supabase SQL Editor
-- This query should show all data regardless of tenant
SELECT * FROM brand_assets;

-- In app, the same query respects RLS:
SELECT * FROM brand_assets; -- Only shows current user's tenant data
```

## Next Steps

### Phase 3: Brand Assets Management
- [ ] Implement asset upload (Supabase Storage)
- [ ] Build asset management UI
- [ ] Add smart rate limiting for asset generation

### Phase 4: Monetization
- [ ] Integrate Stripe Checkout
- [ ] Create webhook handlers
- [ ] Implement feature paywalls

### Phase 5: Production
- [ ] Environment & secrets audit
- [ ] Error handling & monitoring
- [ ] Deploy to Vercel

## Troubleshooting

### "Supabase URL is invalid"
- Ensure `.env.local` is populated with correct values
- The URL should be in format: `https://[project-id].supabase.co`

### "Row-level security" errors
- Verify RLS policies are properly created
- Check `auth.uid()` is returning correct user in SQL queries
- Ensure `tenant_members` has correct entries

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript types are correct
- Verify environment variables are set

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## Support

For issues or questions:
1. Check the console for error messages
2. Review Supabase logs in project dashboard
3. Check network tab for API responses
4. Read the inline code comments
