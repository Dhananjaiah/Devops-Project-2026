# Sprint 6 Runbook — Production readiness (ops)

Date: 2026-01-01

This runbook is the **step-by-step execution guide** for Sprint 6.

Status in this repo (as of this date):
- Monitoring and backup manifests exist, but “production-ready” verification and TLS/gated promotion are not yet implemented end-to-end in this workspace.

---

## Outcome (Sprint 6 Goal)
- HTTPS enabled on gateway
- Monitoring is verifiable (Prometheus targets UP, Grafana dashboards show data)
- Backup + restore drill is repeatable
- GitOps promotion model exists (gated prod deploy)

---

## A) TLS/HTTPS on gateway
High-level steps:
- Obtain certificate (e.g., ACM on AWS)
- Configure gateway listener for TLS and redirect HTTP→HTTPS
- Ensure smoke tests use HTTPS

Verification:
```bash
curl -I https://<gateway-host>/
```

---

## B) Monitoring that actually scrapes
Options to choose in Sprint 6:
- Add `/metrics` to services, or
- Use gateway/controller metrics + blackbox probes

Verification:
- Prometheus Targets show UP
- Grafana dashboards show request/latency/error signals

---

## C) Backup + restore drill
- Run the backup job
- Restore into a fresh MongoDB instance or namespace
- Verify data via API/UI

---

## D) GitOps promotion (gated)
Expected:
- Separate overlays (staging vs prod)
- Promotion via PR/release tag updates prod image tags
- Manual approval gate before prod sync

---

## Evidence to capture
- HTTPS redirect + cert validity proof
- Prometheus targets screenshot/log
- Grafana dashboard screenshot
- Backup artifact + restore proof
- Promotion PR + ArgoCD sync event

---

## Files referenced
- Gateway resources: [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml)
- Monitoring: [k8s/monitoring/prometheus-grafana.yaml](../../k8s/monitoring/prometheus-grafana.yaml)
- Backup job: [k8s/backup/mongodb-backup.yaml](../../k8s/backup/mongodb-backup.yaml)
