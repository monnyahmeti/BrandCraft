cat << 'EOF' > DEVELOPMENT.md
# BrandCraft Development Scope & Roadmap

This document outlines the phased execution plan for building BrandCraft. The focus is on daily, measurable progress, leveraging Next.js (App Router), Supabase, and Stripe.

## Phase 1: Foundation & Authentication
**Objective:** Establish the core repository structure, client-server communication, and user identity.

* [ ] **Task 1.1: Next.js Boilerplate**
  * Initialize Next.js 14/15 App Router.
  * Configure Tailwind CSS and Shadcn UI for the component library.
  * Set up absolute imports and global layout structures.
* [ ] **Task 1.2: Supabase SSR Integration**
  * Install `@supabase/ssr` and `@supabase/supabase-js`.
  * Create server, client, and middleware Supabase utility clients.
* [ ] **Task 1.3: The Auth Flow**
  * Build the Sign-Up and Sign-In pages.
  * Implement OAuth (Google/GitHub) or Magic Link authentication.
  * Sync new Supabase Auth users to the `profiles` table via a database trigger.
* [ ] **Task 1.4: Middleware & Tenancy Routing**
  * Construct the Edge Middleware to protect private routes.
  * Implement logic: Check active session -> Check `tenant_members` -> Route to `/dashboard/[tenant_id]` or redirect to `/onboarding`.

## Phase 2: The Multi-Tenant Workspace
**Objective:** Build the logical isolation layer where users interact with their specific brands.

* [ ] **Task 2.1: Onboarding Engine**
  * Create a wizard for new users to name their first Brand (creates a row in `tenants`).
  * Automatically assign the creator as 'admin' in `tenant_members`.
* [ ] **Task 2.2: Dashboard Shell & State**
  * Build the primary layout (Sidebar, Header, Tenant Switcher dropdown).
  * Implement React Context or Zustand to manage the globally active `tenant_id` on the client side.
* [ ] **Task 2.3: Access Control & Invites**
  * Build the Settings page for the active tenant.
  * Implement the UI to invite new users to the brand workspace.
  * Enforce role-based rendering (Admin, Editor, Viewer) in the UI.

## Phase 3: Core Value Proposition (Brand Assets)
**Objective:** Develop the features that solve the user's primary problem.

* [ ] **Task 3.1: Asset Management Data Access**
  * Build server actions to CRUD brand colors, typography, and logo metadata.
  * Ensure all queries strictly pass the `tenant_id` to comply with Row Level Security.
* [ ] **Task 3.2: Storage Integration**
  * Create a secure upload pipeline for SVGs and images.
  * Link uploaded assets to the Supabase Storage bucket, utilizing RLS policies to restrict read/write access to verified tenant members.
* [ ] **Task 3.3: API & Generation Hooks**
  * Set up internal API routes to handle heavy processing or external AI generation tasks.
  * Implement a **Smart Hybrid** rate limit strategy (combining response caching with request queuing) to manage system load and ensure fair usage across tenants.

## Phase 4: Monetization
**Objective:** Lock premium features behind Stripe subscriptions.

* [ ] **Task 4.1: Stripe Checkout Integration**
  * Build the pricing page utilizing Stripe Checkout for a frictionless payment flow.
  * Pass the `tenant_id` in the Stripe Checkout `client_reference_id` or metadata.
* [ ] **Task 4.2: Webhook Synchronization**
  * Expose a secure API route to receive Stripe Webhooks.
  * Handle `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
  * Update the `plan_type` and `stripe_customer_id` on the `tenants` table based on webhooks.
* [ ] **Task 4.3: Paywall Enforcement**
  * Update server actions and UI components to check the tenant's `plan_type` before allowing access to premium features or higher usage limits.

## Phase 5: Production Readiness
**Objective:** Finalize the application for deployment and real-world usage.

* [ ] **Task 5.1: Environment & Secrets Audit**
  * Ensure all `.env` variables are correctly mapped in the Vercel dashboard.
* [ ] **Task 5.2: Edge Cases & Error Handling**
  * Implement global error boundaries.
  * Add toast notifications for user feedback on all async operations.
* [ ] **Task 5.3: Deployment**
  * Push final main branch to trigger Vercel production build.
  * Run a full end-to-end test in the live environment (Sign up -> Create Brand -> Upgrade to Pro -> Upload Asset).
EOF