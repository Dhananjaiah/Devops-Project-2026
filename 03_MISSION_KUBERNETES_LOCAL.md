# ☸️ Mission 3: Orchestration (Kubernetes Local)

**Role:** Platform Engineer
**Objective:** Stop running containers manually with Docker Compose. Create a container orchestration platform.

---

## 3.1 The Scenario
Docker Compose is great for local dev, but it's not "Production". Production uses **Kubernetes**.
We need to verify that our manifests work on a real cluster. We will use `kind` (Kubernetes in Docker).

**Your Goal:**
1.  Create a Cluster.
2.  Deploy the Database and ConfigMap.
3.  Deploy Microservices.
4.  Expose them via Ingress/Gateway.

---

## 3.2 Create the Cluster
```bash
# Create a cluster named "ecommerce"
kind create cluster --name ecommerce
```

**Verify:**
```bash
kubectl cluster-info
kubectl get nodes
```
You should see 1 control-plane node passing.

---

## 3.3 Loading Images (The "Kind" Trick)
Since `kind` runs inside Docker, it can't see the images on your host unless you "load" them.

```bash
# Load the images we built in Mission 2
kind load docker-image product-service:latest user-service:latest cart-service:latest order-service:latest ui:latest --name ecommerce
```
*Tip: If you skip this, Kubernetes will try to pull from Docker Hub and fail (ImagePullBackOff).*

---

## 3.4 Deploy Manifests (Manual)
We have prepared standard YAML manifests in `k8s/`.

**1. Create Namespace & Database**
```bash
kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml
kubectl apply -f k8s/databases/mongodb.yaml
```

**2. Config & Secrets**
```bash
kubectl apply -f k8s/configmaps/
```

**3. Deploy Services**
```bash
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

---

## 3.5 Verification
Check the status of your pods in the `ecommerce` namespace.

```bash
kubectl get pods -n ecommerce
```

**Mission Success Criteria:**
*   All pods are `1/1 Running`.
*   `kubectl logs -n ecommerce deployment/product-service` shows "Connected to MongoDB".

To test functionality, use `port-forward` (since we aren't using a real LoadBalancer yet):

```bash
kubectl port-forward svc/product-service 3001:3001 -n ecommerce
# Application is now accessible at localhost:3001
```

---

**[NEXT MISSION] -> 04_MISSION_GITOPS_PRODUCTION.md**
