# Course Sprint Plan (2-Week Sprints)

This course uses the existing repo as a baseline and runs 6 x 2-week sprints to reach a real-world outcome: **UI + microservices**, running locally, on local Kubernetes, and then on AWS EKS with CI/CD.

## Readiness + Sprint Execution Docs
- Sprint readiness report: [course/SPRINT_READINESS_REPORT.md](SPRINT_READINESS_REPORT.md)
- Sprint 1: [course/sprints/SPRINT_01_LOCAL_BASELINE.md](sprints/SPRINT_01_LOCAL_BASELINE.md)
- Sprint 2: [course/sprints/SPRINT_02_BACKEND_HARDENING.md](sprints/SPRINT_02_BACKEND_HARDENING.md)
- Sprint 3: [course/sprints/SPRINT_03_UI_MVP.md](sprints/SPRINT_03_UI_MVP.md)
- Sprint 4: [course/sprints/SPRINT_04_LOCAL_K8S_GITOPS.md](sprints/SPRINT_04_LOCAL_K8S_GITOPS.md)
- Sprint 5: [course/sprints/SPRINT_05_AWS_STAGING_CICD.md](sprints/SPRINT_05_AWS_STAGING_CICD.md)
- Sprint 6: [course/sprints/SPRINT_06_PRODUCTION_READINESS.md](sprints/SPRINT_06_PRODUCTION_READINESS.md)

## Working Agreements (Course DoD)
- A sprint increment must be demoable in <10 minutes.
- Every story has clear Acceptance Criteria.
- No “false green” pipelines (CI must fail when quality gates aren’t met).
- Docs are updated as part of the work.

## Sprint 1 — Local baseline + quality gates
**Goal:** Anyone can run locally and demo the journey reliably.
**Demo:** `make local` + health checks + end-to-end journey (register → login → product → cart → order).

## Sprint 2 — Backend hardening (prod behaviors)
**Goal:** Backend configuration and readiness reflect production concerns.
**Demo:** Show readiness fails when Mongo is down; show product IDs work end-to-end.

## Sprint 3 — UI MVP (React + Node host)
**Goal:** UI completes the same journey as curl.
**Demo:** User completes full journey using UI.

## Sprint 4 — Prod-like local Kubernetes
**Goal:** Full stack runs on local Kubernetes with Gateway API routing and GitOps deployment.
**Demo:** ArgoCD is installed; App-of-Apps sync deploys UI + services; UI calls `/api/*` through the same gateway host.

## Sprint 5 — AWS staging + CI/CD
**Goal:** Automated staging deploy to EKS with GitOps (ArgoCD) and smoke tests.
**Demo:** Merge to main builds/pushes images then updates GitOps tags; ArgoCD sync deploys; smoke tests pass.

## Sprint 6 — Production readiness (ops)
**Goal:** HTTPS + monitoring + backup/restore are verifiable.
**Demo:** HTTPS gateway; Prometheus scrape; run backup and restore drill.

## Jira Import
- Jira CSV backlog: see [jira/COURSE_JIRA_BACKLOG.csv](../jira/COURSE_JIRA_BACKLOG.csv)
