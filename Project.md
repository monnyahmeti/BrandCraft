cat << 'EOF' > Project.md
# Project Charter: BrandCraft

## 1. Core Definition
BrandCraft is a multi-tenant SaaS application designed to solve the high-frequency problem of brand identity generation and asset management. It operates as a "Solution Product," providing immediate, actionable value to end-users globally.

## 2. Operational Objectives
* **Macro Goal:** Achieve a $300,000 Annual Recurring Revenue (ARR).
* **Micro Focus:** Daily, measurable engineering progress. The priority is rapid deployment, continuous iteration, and maintaining high execution momentum over passive planning.

## 3. Technology Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS, Shadcn UI.
* **Backend/BaaS:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
* **Payments:** Stripe (Checkout, Billing, Webhooks).
* **Infrastructure:** Vercel (Hosting, Edge Middleware).

## 4. Key Engineering Directives
* **Strict Multi-Tenancy:** All data must be isolated per brand entity.
* **Security by Default:** Row Level Security (RLS) is mandatory on all database tables.
* **Performance:** Implement the "Smart Hybrid" rate-limiting strategy across all API endpoints, combining response caching with request queuing to ensure stability under load.
* **Stateless Client:** Rely on server components and server actions where possible to reduce client-side bundle size and complexity.
EOF