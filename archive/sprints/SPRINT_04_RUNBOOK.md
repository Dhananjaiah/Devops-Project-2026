# Sprint 4 Runbook — Prod-like local Kubernetes (Gateway API + GitOps)

Date: 2026-01-01

This runbook is the **step-by-step execution guide** for Sprint 4.

Status in this repo (as of this date):
- Gateway API resources exist and have been validated locally.
- Full GitOps repo structure (Kustomize overlays + ArgoCD App-of-Apps) is **not yet implemented** in this workspace.

---

## Outcome (Sprint 4 Goal)
- Full stack runs on local Kubernetes
- Gateway routes UI at `/` and APIs at `/api/*`
- GitOps (ArgoCD + Kustomize overlays) manages deployment

---

## Prereqs
- `kubectl`, `kind`, `helm`, `docker`

---

## A) Create kind cluster
```bash
kind create cluster --name ecommerce --image kindest/node:v1.31.0
kubectl cluster-info
```

---

## B) Build and load images into kind
Build images:
```bash
docker build -t product-service:latest microservices/product-service
docker build -t user-service:latest microservices/user-service
docker build -t cart-service:latest microservices/cart-service
docker build -t order-service:latest microservices/order-service
docker build -t ui:latest microservices/ui
```

Load into kind:
```bash
kind load docker-image product-service:latest user-service:latest cart-service:latest order-service:latest ui:latest --name ecommerce
```

---

## C) Deploy app manifests
```bash
kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml
kubectl apply -f k8s/databases/mongodb.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

Wait for readiness:
```bash
kubectl -n ecommerce get pods
kubectl -n ecommerce wait --for=condition=Available deployment/mongodb --timeout=240s
kubectl -n ecommerce wait --for=condition=Available deployment/product-service deployment/user-service deployment/cart-service deployment/order-service --timeout=240s
```

---

## D) Install Gateway API controller (Envoy Gateway)
See the dedicated runbook:
- [course/sprints/GATEWAY_RUNBOOK.md](GATEWAY_RUNBOOK.md)

---

## E) Apply Gateway resources and validate routing
```bash
kubectl apply -f k8s/gateway/gateway.yaml
```

Port-forward the Envoy data-plane service and test:
```bash
kubectl -n envoy-gateway-system get svc | grep envoy-

kubectl -n envoy-gateway-system port-forward svc/<envoy-service-name> 8080:80

curl -i http://127.0.0.1:8080/api/products
```

UI-at-`/` validation (once UI is routed through gateway):
- Open `http://127.0.0.1:8080/`
- Ensure UI calls `/api/*` successfully

---

## F) GitOps steps (ArgoCD + App-of-Apps)
Now that we have local Kubernetes running, let's enable GitOps.

1.  **Install ArgoCD**
    ```bash
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```

2.  **Wait for ArgoCD to be ready**
    ```bash
    kubectl wait --for=condition=Available deployment/argocd-server -n argocd --timeout=300s
    ```

3.  **Apply the Root Application**
    This tells ArgoCD to look at *this* repository and deploy everything else.
    ```bash
    kubectl apply -f k8s/argocd/root-app.yaml
    ```

4.  **Verify Synchronization**
    ArgoCD will now sync:
    - Namespace (`ecommerce`)
    - Databases (`k8s/databases`)
    - Configs (`k8s/configmaps`)
    - Services (`k8s/deployments`)

    Check status:
    ```bash
    kubectl get applications -n argocd
    ```
    All apps should eventually show `Synced` and `Healthy`.

---

## Verification checklist
- `kubectl -n ecommerce get pods` shows Ready pods
- Curl through gateway works for `/api/*`
- UI loads (direct service or via gateway depending on overlay)

---

## Files referenced
- Gateway resources: [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml)
- Envoy Gateway install steps: [course/sprints/GATEWAY_RUNBOOK.md](GATEWAY_RUNBOOK.md)
