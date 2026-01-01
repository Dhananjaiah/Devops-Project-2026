# Jira Paste: Epic → Story → Task

Paste-friendly mapping for planning/review meetings.

---

Epic 1: Course Foundation: Repos, Standards, and Trunk-Based Workflow
- ST-1 Local runbook + demo script (Sprint 1)
  - TASK ST-1.1 Add demo script skeleton
  - TASK ST-1.2 Tighten Quickstart for course
  - TASK ST-1.3 Add demo evidence template

Epic 2: Terraform Bootstrap: Remote State + IAM + GitHub OIDC
- ST-13 Terraform bootstrap for staging (Sprint 5)

Epic 4: EKS Cluster Baseline: Managed Node Groups + Autoscaling + Required Add-ons
- ST-10 Local Kubernetes overlay (kind/minikube) (Sprint 4)
- ST-12 Network policies match gateway reality (Sprint 4)

Epic 5: Gateway API + Domain: ALB + TLS
- ST-11 Gateway routing UI + APIs (Sprint 4)
- ST-16 HTTPS/TLS on gateway (Sprint 6)

Epic 6: ArgoCD Production Bootstrap + App-of-Apps (Separate GitOps Repo)
- ST-19 Install ArgoCD (local k8s) (Sprint 4)
  - TASK ST-19.1 Add ArgoCD install method + doc
  - TASK ST-19.2 Expose ArgoCD UI for course demo
- ST-20 GitOps repo structure + App-of-Apps bootstrap (Sprint 4)
  - TASK ST-20.1 Define GitOps repo layout
  - TASK ST-20.2 Create root application (App-of-Apps)
  - TASK ST-20.3 Add dev namespace + Argo project boundaries
- ST-21 GitOps-driven staging deploy (CI updates tags) (Sprint 5)
  - TASK ST-21.1 CI updates GitOps dev tags
  - TASK ST-21.2 ArgoCD auto-sync for dev
  - TASK ST-21.3 Smoke tests run after sync
- ST-22 GitOps production promotion (gated) (Sprint 6)
  - TASK ST-22.1 Promotion workflow (release/tag)
  - TASK ST-22.2 Prod ArgoCD sync policy
  - TASK ST-22.3 Rollback drill

Epic 7: Observability: Prometheus + Grafana (+ Loki optional)
- ST-17 Monitoring that actually scrapes (Sprint 6)
- ST-18 Backup + restore drill (Sprint 6)

Epic 8: Walking Skeleton App: Services + UI
- ST-4 Mongo auth consistency (compose + k8s) (Sprint 2)
- ST-5 Dependency-aware readiness (DB) (Sprint 2)
- ST-6 Fix product ID correctness end-to-end (Sprint 2)
- ST-7 React UI (Vite) MVP (Sprint 3)
- ST-8 Node-based UI hosting service (Sprint 3)
- ST-9 Wire UI into docker-compose (Sprint 3)

Epic 9: CI/CD
- ST-2 Make CI honest (remove default skipping) (Sprint 1)
  - TASK ST-2.1 Minimal lint/test baseline per service
  - TASK ST-2.2 Update ci.yaml gates
- ST-14 Single CD pipeline + correct smoke tests (Sprint 5)
- ST-15 Release tagging + promotion (Sprint 5)

Epic 10: Automation: One-command Up/Down
- (No stories/tasks mapped yet in the aligned CSV)
