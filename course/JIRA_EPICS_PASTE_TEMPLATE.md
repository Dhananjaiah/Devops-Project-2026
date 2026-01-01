# Jira Epics (Paste Template)

Copy/paste these into Jira Epics if you want a clean set aligned to this repo.

## Epic 1 — Course Foundation: Repos, Standards, and Trunk-Based Workflow
**Outcome:** Learners can run locally, follow trunk-based PR flow, and understand standards.
**Done when:** branch protections + templates exist; local demo runbook exists; quality gates are honest.

## Epic 2 — Terraform Bootstrap: Remote State + IAM + GitHub OIDC
**Outcome:** No long-lived AWS keys; reproducible terraform state.
**Done when:** S3 state + DynamoDB lock are bootstrapped; GitHub Actions uses OIDC to run plan/apply.

## Epic 4 — EKS Cluster Baseline
**Outcome:** Repeatable EKS provisioning with baseline add-ons.
**Done when:** EKS + nodegroup provisioned via Terraform; metrics-server/EBS CSI (or equivalents) installed; cluster healthy.

## Epic 5 — Gateway API + TLS
**Outcome:** Single entrypoint host for UI + APIs with HTTPS.
**Done when:** Gateway routes UI `/` and APIs `/api/*`; HTTPS is enabled; smoke tests pass.

## Epic 6 — ArgoCD + GitOps (Recommended)
**Outcome:** Deployments are GitOps-driven (no ad-hoc kubectl apply for apps).
**Done when:** ArgoCD installed; App-of-Apps bootstraps platform+apps; CI updates GitOps image tags; dev auto-sync and prod promotion are documented.

**Course choice:** GitOps manifests use **Kustomize** (base + overlays per environment).

## Epic 7 — Observability
**Outcome:** You can troubleshoot like real ops: metrics + dashboards (logs optional).
**Done when:** Prometheus scrapes services; Grafana dashboard shows traffic/errors/latency.

## Epic 8 — Walking Skeleton App (Services + UI)
**Outcome:** Working product flow end-to-end via UI.
**Done when:** register/login, products, cart, orders work; config consistent across envs.

## Epic 9 — CI/CD
**Outcome:** Automated build → scan → deploy to staging; controlled prod release.
**Done when:** one pipeline is the source of truth; staging deploy + smoke tests succeed; release tagging documented.

## Epic 10 — Automation (Optional)
**Outcome:** One-command up/down flows for course demos.
**Done when:** scripts bring up/down stacks safely; cleanup verification exists.
