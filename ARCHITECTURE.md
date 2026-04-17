cat << 'EOF' > ARCHITECTURE.md
# System Architecture: BrandCraft

This document defines the structural patterns, security models, and data flows for the BrandCraft platform.

## 1. Tenancy Model
The application utilizes a **Shared Database, Shared Schema** architecture. 
* All tenant (brand) data resides in the same database tables.
* A mandatory `tenant_id` discriminator column exists on every resource table (e.g., `brand_assets`, `projects`).
* The `tenants` table acts as the root entity for all billing and organizational data.

## 2. Authentication & Authorization
* **Identity:** Managed via Supabase Auth.
* **Access Control Matrix:** Implemented via the `tenant_members` join table, assigning users specific roles within a tenant context:
  * `admin`: Full read/write/delete access, billing management, and user invitation rights.
  * `editor`: Read/write access to brand assets and projects.
  * `viewer`: Read-only access to the workspace.
* **Middleware:** Next.js Edge Middleware intercepts all requests to `/dashboard/*` to verify active Supabase sessions and validate `tenant_id` context before rendering.

## 3. Database Security (RLS)
Application-level logic is not trusted to filter tenant data. PostgreSQL Row Level Security (RLS) policies enforce the tenant boundary at the database level.
* **Standard Policy Pattern:** `auth.uid() IN (SELECT user_id FROM tenant_members WHERE tenant_id = target_table.tenant_id)`

## 4. API & Resource Management
* **Smart Hybrid Rate Limiting:** To ensure system fairness and prevent abuse, API routes utilize a hybrid strategy:
  1. **Response Caching:** High-frequency, deterministic read requests (e.g., fetching standard brand guidelines) are aggressively cached.
  2. **Request Queuing:** Heavy compute tasks (e.g., AI asset generation) are placed in a queue system to manage concurrency and protect backend resources from spiking.

## 5. Monetization Data Flow
Stripe serves as the source of truth for billing.
1. User initiates a subscription via Stripe Checkout.
2. Stripe emits webhooks (e.g., `checkout.session.completed`, `customer.subscription.updated`).
3. A secure Next.js API route consumes the webhook, verifies the signature, and updates the `plan_type` and `stripe_customer_id` directly on the corresponding row in the `tenants` table.
4. RLS policies and server actions dynamically adjust feature access based on the `plan_type` enum.
EOF