# Sprint 2 Runbook — Backend Hardening (Readiness + Mongo Auth Alignment)

This runbook captures the exact actions and commands used to complete Sprint 2.

## Goals delivered

- Add **DB-aware readiness** endpoints (`GET /ready`) across all services.
- Make **product IDs consistently Mongo ObjectIds** end-to-end.
- Align **Kubernetes MongoDB auth + service env** so apps can authenticate to Mongo in-cluster.
- Update **Kubernetes readiness probes** to use `/ready` (not `/health`).

## What changed (implementation)

### Service readiness (`/ready`)

- Node services now expose:
  - Product service: `GET /ready` returns `200` only when Mongo is reachable.
  - Cart service: `GET /ready` returns `200` only when Mongo is reachable.
- Python services now expose:
  - User service: `GET /ready` pings Mongo via `client.admin.command("ping")`.
  - Order service: `GET /ready` pings Mongo via `client.admin.command("ping")`.
- Python Mongo clients fail fast using `serverSelectionTimeoutMS=2000`.

### Product ID correctness

- Product service CRUD now treats IDs as Mongo ObjectIds (24-hex), converting `_id` to string in API responses.

## What changed (Kubernetes)

### MongoDB root password aligned

- Mongo root password in Kubernetes was aligned to `password123` to match existing app secret usage and local compose.

### Credentialed Mongo URL provided via Secret

- Added a Secret containing the full Mongo connection URI (with authSource=admin):
  - [k8s/configmaps/mongodb-connection.yaml](k8s/configmaps/mongodb-connection.yaml)

### Deployments updated

- All microservice deployments now read `MONGO_URL` from the Secret key `mongo-url`.
- Readiness probes were updated from `/health` to `/ready`.

## Commands run (local validation)

From repo root:

- Build and start services locally:
  - `make local`

- Run end-to-end journey:
  - `bash ./scripts/demo.sh`

Notes:
- If you prefer, you can also run `make test` (it uses the same flow).
- If you want to run `./scripts/demo.sh` directly, set execute permission once:
  - `chmod +x scripts/demo.sh`

## Commands to apply Sprint 2 to Kubernetes

From repo root:

### Option A: kind (recommended for local Kubernetes)

- Install kind (no sudo):
  - `mkdir -p ~/.local/bin`
  - `curl -fsSL -o ~/.local/bin/kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64`
  - `chmod +x ~/.local/bin/kind`

- Create cluster:
  - `~/.local/bin/kind create cluster --name ecommerce --image kindest/node:v1.31.0`

- Build service images using the tags referenced by the manifests:
  - `docker build -t product-service:latest microservices/product-service`
  - `docker build -t cart-service:latest microservices/cart-service`
  - `docker build -t user-service:latest microservices/user-service`
  - `docker build -t order-service:latest microservices/order-service`

- Load images into kind:
  - `~/.local/bin/kind load docker-image product-service:latest cart-service:latest user-service:latest order-service:latest --name ecommerce`

- Apply manifests:
  - `kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml`
  - `kubectl apply -f k8s/databases/mongodb.yaml`
  - `kubectl apply -f k8s/configmaps/app-config.yaml -f k8s/configmaps/app-secrets.yaml -f k8s/configmaps/mongodb-connection.yaml`
  - `kubectl apply -f k8s/deployments -f k8s/services`

- Wait for readiness:
  - `kubectl -n ecommerce wait --for=condition=Available deployment/mongodb --timeout=240s`
  - `kubectl -n ecommerce wait --for=condition=Available deployment/product-service deployment/user-service deployment/cart-service deployment/order-service --timeout=240s`
  - `kubectl -n ecommerce get pods`

- Verify `/ready` from inside the cluster:
  - `kubectl -n ecommerce run curl-check --rm -i --restart=Never --image=curlimages/curl:8.6.0 --command -- sh -c 'for svc in product-service:3001 cart-service:3003 user-service:3002 order-service:3004; do echo "=== $svc ==="; curl -fsS http://$svc/ready; echo; done'`

### Option B: existing cluster

- Create namespace (if not already present):
  - `kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml`

- Apply MongoDB (includes updated root password Secret):
  - `kubectl apply -f k8s/databases/mongodb.yaml`

- Apply app config/secrets + Mongo connection Secret:
  - `kubectl apply -f k8s/configmaps/app-config.yaml`
  - `kubectl apply -f k8s/configmaps/app-secrets.yaml`
  - `kubectl apply -f k8s/configmaps/mongodb-connection.yaml`

- Apply deployments (now using `MONGO_URL` from Secret + `/ready` probes):
  - `kubectl apply -f k8s/deployments/product-service.yaml`
  - `kubectl apply -f k8s/deployments/user-service.yaml`
  - `kubectl apply -f k8s/deployments/cart-service.yaml`
  - `kubectl apply -f k8s/deployments/order-service.yaml`

- Apply services:
  - `kubectl apply -f k8s/services/product-service.yaml`
  - `kubectl apply -f k8s/services/user-service.yaml`
  - `kubectl apply -f k8s/services/cart-service.yaml`
  - `kubectl apply -f k8s/services/order-service.yaml`

## Quick verification (Kubernetes)

- Check pods become Ready:
  - `kubectl -n ecommerce get pods`

- Spot-check readiness endpoints:
  - `kubectl -n ecommerce port-forward deploy/product-service 3001:3001`
  - `curl -i http://localhost:3001/ready`

## Files touched in Sprint 2

- [k8s/configmaps/mongodb-connection.yaml](k8s/configmaps/mongodb-connection.yaml)
- [k8s/databases/mongodb.yaml](k8s/databases/mongodb.yaml)
- [k8s/deployments/product-service.yaml](k8s/deployments/product-service.yaml)
- [k8s/deployments/user-service.yaml](k8s/deployments/user-service.yaml)
- [k8s/deployments/cart-service.yaml](k8s/deployments/cart-service.yaml)
- [k8s/deployments/order-service.yaml](k8s/deployments/order-service.yaml)
