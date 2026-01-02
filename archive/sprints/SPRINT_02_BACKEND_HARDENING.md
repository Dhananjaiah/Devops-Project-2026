# Sprint 2 — Backend hardening (prod behaviors)

**Sprint Goal:** Backend configuration and readiness reflect production concerns.

## Scope (Aligned to Jira)
- Epic 8: Walking Skeleton App: Services + UI
  - ST-4 Mongo auth consistency (compose + k8s)
  - ST-5 Dependency-aware readiness (DB)
  - ST-6 Fix product ID correctness end-to-end

## Current repo status (starting point)
- MongoDB in Compose uses root creds but services connect without creds:
  - [docker-compose.yaml](../../docker-compose.yaml)
- MongoDB in k8s uses secret-based root creds:
  - [k8s/databases/mongodb.yaml](../../k8s/databases/mongodb.yaml)
- Services readiness probes hit `/health` but `/health` does not verify DB:
  - Example: [microservices/product-service/index.js](../../microservices/product-service/index.js)
- Product ID mismatch risk:
  - create uses `insertOne` (ObjectId)
  - get uses `findOne({ _id: req.params.id })` (string)

## Deliverables
- Mongo connection is consistent and secure-enough for course:
  - Compose uses credentialed URI
  - Kubernetes uses Secret for URI or username/password
- Readiness (`/ready`) fails if DB is unavailable; liveness (`/health`) stays process-based
- End-to-end journey works reliably (IDs correct): create product → fetch → cart → order

## Runbook
- [course/sprints/SPRINT_02_RUNBOOK.md](SPRINT_02_RUNBOOK.md)

## Implementation checklist (what to change)
1) **Mongo auth consistency**
- Update Compose:
  - change service `MONGO_URL` to include credentials
  - use `.env` or compose env vars (do not hardcode secrets in code)

- Update Kubernetes manifests:
  - inject credentialed connection string via Secret/Env
  - stop using unauthenticated `mongodb://mongodb:27017`

2) **Dependency-aware readiness**
- Add `GET /ready` to each service that checks:
  - DB client connected / can ping Mongo
- Keep `GET /health` as “process up” (does not hard fail due to DB)
- Update k8s probes to point readinessProbe to `/ready` (keep liveness on `/health`)

3) **Fix Product ID correctness**
- Node services should treat Mongo `_id` as `ObjectId` consistently.
  - product-service: parse `:id` to `ObjectId` when querying
  - cart-service: treat `productId` as string but ensure it matches product-service representation
  - order-service: ensure it can create order from cart items reliably

## Verification (Definition of Done)
- Compose:
  - full journey script succeeds (see Sprint 1 demo script)
  - restart Mongo and verify services recover

- Readiness:
  - stop Mongo container and verify `/ready` returns non-200
  - start Mongo and verify `/ready` returns 200 again

- ID correctness:
  - create product returns id
  - fetch product by id returns the product
  - add to cart succeeds
  - create order succeeds

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 2.
