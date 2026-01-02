# Sprint 4 — Prod-like local Kubernetes (Gateway API + GitOps)

**Sprint Goal:** Full stack runs on local Kubernetes with Gateway API routing and GitOps deployment.

## Scope (Aligned to Jira)
- Epic 4: EKS Cluster Baseline (local-k8s overlay work)
  - ST-10 Local Kubernetes overlay (kind/minikube)
  - ST-12 Network policies match gateway reality
- Epic 5: Gateway API + Domain
  - ST-11 Gateway routing UI + APIs
- Epic 6: ArgoCD + GitOps (Kustomize)
  - ST-19 Install ArgoCD (local k8s)
  - ST-20 GitOps repo structure + App-of-Apps bootstrap

## Current repo status (starting point)
- Existing Gateway API routes (APIs only today):
  - [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml)
- Existing Ingress is now deprecated and kept only as historical reference:
  - [k8s/ingress/ingress.yaml](../../k8s/ingress/ingress.yaml)
- GitOps repo + Kustomize overlays do not exist yet.

## Deliverables
- A local-k8s overlay that deploys:
  - MongoDB + services + UI
  - gateway that serves UI at `/` and APIs at `/api/*`
- ArgoCD installed locally (official manifests, pinned version)
- GitOps repo structure using **Kustomize overlays** per environment
- App-of-Apps bootstraps everything

## Runbook
- [course/sprints/SPRINT_04_RUNBOOK.md](SPRINT_04_RUNBOOK.md)
- [course/sprints/GATEWAY_RUNBOOK.md](GATEWAY_RUNBOOK.md)

## Implementation checklist (what to change)
1) **Create local k8s overlays (Kustomize)**
- Add `k8s/overlays/local/` with:
  - namespace
  - deployments/services
  - gateway controller choice for local (Envoy Gateway)

2) **Gateway API alignment**

- Install Envoy Gateway (includes Gateway API CRDs):
  - `helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.6.1 -n envoy-gateway-system --create-namespace`
  - `kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available`

- Apply Gateway API resources:
  - `kubectl apply -f k8s/gateway/gateway.yaml`

- Local kind testing (no LoadBalancer):
  - Identify the Envoy data-plane service:
    - `kubectl -n envoy-gateway-system get svc | grep envoy-`
  - Port-forward it and curl through the gateway:
    - `kubectl -n envoy-gateway-system port-forward svc/<envoy-service> 8080:80`
    - `curl -i http://127.0.0.1:8080/api/products`
- Ensure UI is reachable at `/`
- Ensure API paths route to services under `/api/*`

3) **ArgoCD install (local)**
- Add docs + scripts to install ArgoCD via official manifests

4) **GitOps repo (separate)**
- Create and document GitOps repo layout (Kustomize base + overlays)
- Add root Argo Application (App-of-Apps)

## Verification (Definition of Done)
- On kind/minikube:
  - `kubectl get pods` is healthy
  - UI loads in browser
  - UI calls APIs via `/api/*`
- ArgoCD:
  - UI reachable
  - App-of-Apps sync shows all apps Healthy/Synced

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 4.
