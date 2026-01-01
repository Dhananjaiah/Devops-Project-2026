# Sprint 6 — Production readiness (ops)

**Sprint Goal:** HTTPS + monitoring + backup/restore are verifiable and repeatable.

## Scope (Aligned to Jira)
- Epic 5: Gateway API + TLS
  - ST-16 HTTPS/TLS on gateway
- Epic 7: Observability
  - ST-17 Monitoring that actually scrapes
  - ST-18 Backup + restore drill
- Epic 6: GitOps promotion
  - ST-22 GitOps production promotion (gated)

## Current repo status (starting point)
- Legacy Ingress has ALB annotations but is deprecated (historical reference):
  - [k8s/ingress/ingress.yaml](../../k8s/ingress/ingress.yaml)
- Gateway API resources exist for local routing, but production TLS is not implemented:
  - [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml)
- Monitoring YAML exists but is not aligned to actual services (ports/metrics endpoints):
  - [k8s/monitoring/prometheus-grafana.yaml](../../k8s/monitoring/prometheus-grafana.yaml)
- Backup job exists:
  - [k8s/backup/mongodb-backup.yaml](../../k8s/backup/mongodb-backup.yaml)

## Deliverables
- HTTPS enabled (ACM) and HTTP → HTTPS redirect
- Monitoring works for real:
  - Prometheus scrapes targets successfully
  - Grafana dashboards show meaningful service signals
- Backup + restore drill reproducible
- GitOps promotion model implemented (gated prod)

## Runbook
- [course/sprints/SPRINT_06_RUNBOOK.md](SPRINT_06_RUNBOOK.md)

## Implementation checklist (what to change)
1) **TLS/HTTPS**
- Configure ACM cert ARN and redirect annotations
- Ensure smoke tests use HTTPS

2) **Observability alignment**
- Decide metrics approach:
  - add `/metrics` to services, OR
  - use blackbox/http probes + gateway metrics only
- Ensure ServiceMonitor/targets match real service ports

3) **Backup + restore drill**
- Validate backup job produces artifacts
- Document restore steps and verification via API/UI

4) **GitOps promotion**
- Promotion via release/tag or PR
- Prod overlay updates image tags
- ArgoCD prod sync policy gated/manual

## Verification (Definition of Done)
- HTTPS returns valid cert and redirects from HTTP
- Prometheus targets are UP; Grafana shows data
- Backup job runs and restore recovers data
- Promotion updates prod and rollback via Git revert works

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 6.
