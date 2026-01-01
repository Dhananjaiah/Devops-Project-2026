# Sprint 5 — AWS staging + CI/CD (GitOps-driven)

**Sprint Goal:** Automated staging deploy to EKS with GitOps (ArgoCD) and smoke tests.

## Scope (Aligned to Jira)
- Epic 2: Terraform Bootstrap
  - ST-13 Terraform bootstrap for staging
- Epic 9: CI/CD
  - ST-14 Single CD pipeline + correct smoke tests
  - ST-15 Release tagging + promotion
- Epic 6: ArgoCD + GitOps
  - ST-21 GitOps-driven staging deploy (CI updates tags)

## Current repo status (starting point)
- Terraform exists under [terraform/](../../terraform/)
- CD workflow exists but:
  - uses static AWS keys (not OIDC)
  - mutates k8s manifests via `sed`
  - smoke tests call `/api/*/health` but services are `/health`
  - file: [.github/workflows/cd.yaml](../../.github/workflows/cd.yaml)

## Deliverables
- Staging EKS provisioned (Terraform)
- CI builds/pushes images with deterministic tags
- CI updates GitOps repo image tags (dev/staging overlay)
- ArgoCD sync deploys staging
- Smoke tests run against gateway URL and actually hit valid endpoints

## Runbook
- [course/sprints/SPRINT_05_RUNBOOK.md](SPRINT_05_RUNBOOK.md)

## Implementation checklist (what to change)
1) **Terraform staging bootstrap**
- Ensure remote state + OIDC (per Epic 2)

2) **Single CD pipeline**
- Choose one workflow as source of truth
- Remove manifest mutation-in-place; instead update GitOps repo tags

3) **Smoke tests correctness**
- Smoke tests should call:
  - `http(s)://<host>/health` via per-service routing OR
  - expose `/api/<service>/health` only if services implement it

## Verification (Definition of Done)
- Merge to main results in:
  - images pushed
  - GitOps repo commit updating tags
  - ArgoCD sync to staging
  - smoke tests pass

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 5.
