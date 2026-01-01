# Sprint 3 — UI MVP (React + Node host)

**Sprint Goal:** UI completes the same user journey as curl.

## Scope (Aligned to Jira)
- Epic 8: Walking Skeleton App: Services + UI
  - ST-7 React UI (Vite) MVP
  - ST-8 Node-based UI hosting service
  - ST-9 Wire UI into docker-compose

## Current repo status (starting point)
- No UI exists today.
- APIs exist on localhost ports (3001–3004) via [docker-compose.yaml](../../docker-compose.yaml).

## Deliverables
- A React UI (Vite) that supports:
  - register/login
  - list/create products
  - cart add/view
  - place order + view orders
- A Node/Express UI host service that serves the built SPA.
- `make local` brings up UI + APIs.

## Runbook
- [course/sprints/SPRINT_03_RUNBOOK.md](SPRINT_03_RUNBOOK.md)

## Implementation checklist (what to change)
1) **Create UI service**
- Add `microservices/ui/` (or `microservices/frontend/`) with:
  - Vite React app
  - `.env` for API base (default to `/api` when behind Gateway API; `http://localhost:3001` etc for local dev)

2) **Node-based hosting**
- Add a small Express server to:
  - serve static build
  - support SPA client routing

3) **Compose wiring**
- Add UI service to [docker-compose.yaml](../../docker-compose.yaml)
  - map port (e.g., 8080:8080)
  - configure API base URL

## Verification (Definition of Done)
- `make local` starts UI + APIs.
- UI journey works end-to-end:
  - register/login works
  - create a product
  - add to cart
  - create order

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 3.
