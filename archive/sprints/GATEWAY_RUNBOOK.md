# Gateway API Runbook — Envoy Gateway (local kind)

Date: 2026-01-01

This runbook captures the **Gateway API (Envoy Gateway)** setup and verification steps we use in this course.

---

## Outcome
- Gateway API controller installed (Envoy Gateway)
- Gateway + HTTPRoute applied
- Requests routed to services under `/api/*`

---

## Prerequisites
- `kubectl`
- `kind`
- `helm`

---

## 1) Create a local cluster (kind)
```bash
kind create cluster --name ecommerce --image kindest/node:v1.31.0
kubectl cluster-info
```

---

## 2) Install Envoy Gateway (controller + CRDs)
This course uses Envoy Gateway as the Gateway API implementation.

```bash
helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.6.1 -n envoy-gateway-system --create-namespace
kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available
```

Verify controller is running:
```bash
kubectl -n envoy-gateway-system get deploy,po,svc
```

---

## 3) Deploy the app stack (namespace + mongo + services)
Apply your app manifests (namespace/db/config/deployments/services). Example:
```bash
kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml
kubectl apply -f k8s/databases/mongodb.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

Wait for pods:
```bash
kubectl -n ecommerce get pods
```

---

## 4) Apply Gateway API resources
```bash
kubectl apply -f k8s/gateway/gateway.yaml
```

Notes:
- The GatewayClass in [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml) is `eg` and expects the Envoy Gateway controller.

---

## 5) Test routing locally (no LoadBalancer)
On kind, you typically port-forward the Envoy data-plane Service.

1) Find the Service:
```bash
kubectl -n envoy-gateway-system get svc | grep envoy-
```

2) Port-forward it to localhost:
```bash
kubectl -n envoy-gateway-system port-forward svc/<envoy-service-name> 8080:80
```

3) Curl through the gateway:
```bash
curl -i http://127.0.0.1:8080/api/products
curl -i http://127.0.0.1:8080/api/users/health
```

---

## Troubleshooting

### `GatewayClass` not accepted / routes not programmed
- Confirm Envoy Gateway controller is running:
  - `kubectl -n envoy-gateway-system get pods`
- Confirm `GatewayClass eg` exists:
  - `kubectl get gatewayclass`

### 404s on routed paths
- Confirm the HTTPRoute prefixes match your service paths (this repo routes `/api/products`, `/api/users`, `/api/cart`, `/api/orders`).
- Confirm the backend Service ports match (3001–3004).

### Port-forward works but backend returns 503
- Check pods are Ready (`/ready` endpoints) and services exist:
  - `kubectl -n ecommerce get pods,svc`

---

## Files
- Gateway resources: [k8s/gateway/gateway.yaml](../../k8s/gateway/gateway.yaml)
- Deprecated legacy ingress: [k8s/ingress/ingress.yaml](../../k8s/ingress/ingress.yaml)
