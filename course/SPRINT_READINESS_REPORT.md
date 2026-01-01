# Sprint-by-Sprint Readiness Report (As-Is Repo → Course Plan)

Date: 2026-01-01

This report answers: **“Are we ready to start each sprint?”**
- **READY TO START** means: prerequisites + inputs exist, no missing foundational dependency.
- **NOT READY TO START** means: a prerequisite is missing (e.g., UI repo/service does not exist, GitOps repo not defined, local k8s overlay absent).

This is **not** “ready to ship production today”. It’s readiness to execute the sprint and get to the demo.

---

## Sprint 1 — Local baseline + quality gates
**Status:** READY TO START

**What exists already**
- Local orchestration: [docker-compose.yaml](../docker-compose.yaml)
- Make targets: [Makefile](../Makefile)
- Local run guide: [QUICKSTART.md](../QUICKSTART.md)
- Demo checklist skeleton: [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](SPRINT_REVIEW_DEMO_CHECKLIST.md)

**Known gaps to address in Sprint 1 (expected work)**
- CI is “false green” (skips lint/tests/format and continues): [.github/workflows/ci.yaml](../.github/workflows/ci.yaml)
- CD workflow smoke tests call non-existent paths (`/api/*/health` vs actual `/health`): [.github/workflows/cd.yaml](../.github/workflows/cd.yaml)
- Local Mongo auth is inconsistent: Mongo has root creds but services use unauthenticated `mongodb://mongodb:27017`: [docker-compose.yaml](../docker-compose.yaml)

**Sprint 1 demo feasibility:** Yes (services expose `/health`), but end-to-end may be flaky until Sprint 2 fixes DB auth + ID correctness.

---

## Sprint 2 — Backend hardening (prod behaviors)
**Status:** READY TO START

**Inputs already exist**
- Services and Dockerfiles exist under [microservices/](../microservices/)
- k8s manifests exist under [k8s/](../k8s/)

**Key blockers to solve in Sprint 2 (must-do)**
- MongoDB auth consistency across Compose + Kubernetes
- Readiness should be dependency-aware (DB connectivity), not just “process is up”
- Product ID handling is inconsistent (`insertOne` returns `ObjectId` but reads query `_id` as string): [microservices/product-service/index.js](../microservices/product-service/index.js)

---

## Sprint 3 — UI MVP (React + Node host)
**Status:** READY TO START (but UI code does not exist yet)

**What’s missing**
- No UI app/service exists yet (must be created from scratch)

**Inputs available**
- Backend APIs exist and are routable by ports locally

---

## Sprint 4 — Prod-like local Kubernetes (Gateway API + GitOps)
**Status:** NOT READY TO START (needs new overlays + GitOps repo structure)

**Why not ready yet**
- No local-k8s overlay (kind/minikube) exists today (only EKS-ish manifests)
- Current Gateway API only routes `/api/*` and does not serve UI `/`: [k8s/gateway/gateway.yaml](../k8s/gateway/gateway.yaml)
- GitOps repo + Kustomize overlays + ArgoCD apps do not exist yet

---

## Sprint 5 — AWS staging + CI/CD (GitOps-driven)
**Status:** NOT READY TO START (depends on Sprint 4 GitOps + Sprint 2/3 app correctness)

**Why not ready yet**
- Current CD uses static AWS keys, not GitHub OIDC: [.github/workflows/cd.yaml](../.github/workflows/cd.yaml)
- CD mutates manifests via `sed` instead of updating GitOps repo + ArgoCD sync

---

## Sprint 6 — Production readiness (ops)
**Status:** NOT READY TO START (depends on Sprint 5 staging baseline)

**Why not ready yet**
- TLS is noted but not implemented (ACM ARN + redirect action not wired)
- Monitoring manifests exist but are not aligned to actual services (ports/metrics endpoints)

---

## Bottom line
- **Sprints 1–3 are ready to start now.**
- **Sprints 4–6 require new assets (local k8s overlays + GitOps repo + Kustomize structure) before they become start-ready.**

Next: see per-sprint execution docs under [course/sprints/](sprints/).
