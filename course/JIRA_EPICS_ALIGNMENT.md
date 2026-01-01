# Aligning Your Existing Jira Epics to This Repo

You already created larger “platform-style” epics in [jira-epics](../jira-epics). That epic set is **more ambitious** than the current repo (it includes multi-repo GitOps/ArgoCD, Route53, domain/TLS, etc.). This document maps those epics to a clean 6-sprint course plan for **this** project.

## Recommended scope for this repo (real-world but course-friendly)
Use these epics from your list:
- Epic 1 — Course Foundation (workflow + standards)
- Epic 2 — Terraform Bootstrap (remote state + GitHub OIDC)
- Epic 4 — EKS Cluster Baseline
- Epic 5 — Gateway API + TLS (edge routing + certs)
- Epic 7 — Observability (Prometheus/Grafana; Loki optional)
- Epic 8 — Walking Skeleton App (services + UI)
- Epic 9 — CI/CD
- Epic 6 — ArgoCD + separate GitOps repo (recommended)

Optional (cost optimization / deeper infra):
- Epic 3 — Networking + endpoints
- Epic 10 — One-command up/down automation

## Mapping: Your Epic → Course Sprint
### Sprint 1 (Local baseline + quality gates)
- Epic 1: repo standards, trunk-based workflow, protections
- Epic 9: CI for lint/test/build (honest gates)

### Sprint 2 (Backend hardening)
- Epic 8: fix API correctness, DB config consistency, readiness correctness

### Sprint 3 (UI MVP)
- Epic 8: React UI + Node hosting, docker-compose wiring

### Sprint 4 (Prod-like local Kubernetes)
- Epic 4: k8s baseline behaviors + add-ons for local k8s (metrics-server)
- Epic 5: Gateway API routing UI + APIs (Envoy Gateway for local)
- Epic 6: install ArgoCD locally and bootstrap App-of-App(s) against a GitOps repo

### Sprint 5 (AWS staging + CI/CD)
- Epic 2: terraform state bootstrap + OIDC auth
- Epic 4: EKS provisioning via Terraform
- Epic 9: build/push/deploy pipeline + smoke tests
- Epic 6: CD becomes GitOps-driven (CI updates GitOps repo image tags; ArgoCD deploys)

### Sprint 6 (Production readiness / ops)
- Epic 5: TLS/HTTPS at the gateway edge (ACM on EKS)
- Epic 7: Prometheus/Grafana working; Loki optional
- Epic 10: optional automation (make up/down) + time tracking

## GitOps/ArgoCD Track (included)
This course plan includes a real-world GitOps flow:
- App deployments happen via ArgoCD syncing manifests from a GitOps repo.
- CI builds/pushes images, then updates image tags in the GitOps repo.
- Dev environment can auto-sync; production promotion is gated (release/tag + approval).

## Known mismatch to fix when you go “real-world mode”
- This repo currently uses a single repo layout; your Epic 1 assumes 3 repos (Infra/App/GitOps). You can either:
  - Keep one repo for the course and treat “GitOps repo” as an advanced add-on sprint, OR
  - Split repos in Sprint 5–6 (advanced track).

## Next step
If you confirm whether you want the **GitOps/ArgoCD track** (Epic 6) included, I can regenerate the Jira CSV to include that epic and add sprint stories for it.

## Epic → Story → Task mapping
- Human-readable: [course/EPIC_STORY_TASK_MAP.md](EPIC_STORY_TASK_MAP.md)
- Paste-friendly: [course/JIRA_EPIC_STORY_TASK_PASTE.md](JIRA_EPIC_STORY_TASK_PASTE.md)
