# 🎓 DevOps Student Cheat Sheet

A quick reference for the most common commands you will use in this course.

---

## 🛠️ Day 0: Setup & Checks

**Check your environment**
```bash
./scripts/check-env.sh
```

**Clean start (Stop everything)**
```bash
make local-down
# or
docker compose down -v
```

---

## 🏃 Sprint 1-3: Local Development

**Start everything (Docker Compose)**
```bash
make local
```

**View Logs**
```bash
make local-logs
# Follow specific service
docker compose logs -f product-service
```

**Run the Demo Journey (Automated Test)**
```bash
bash scripts/demo.sh
```

**Manual Health Check**
```bash
curl http://localhost:3001/health
```

---

## ☸️ Sprint 4: Local Kubernetes (Kind)

**Create Cluster**
```bash
kind create cluster --name ecommerce
```

**Build & Load Images**
```bash
# Build
make build
# Load into Kind
kind load docker-image product-service:latest user-service:latest cart-service:latest order-service:latest ui:latest --name ecommerce
```

**Deploy (Manual)**
```bash
make deploy
```

**Deploy (GitOps / ArgoCD)**
```bash
# 1. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Apply Root App
kubectl apply -f k8s/argocd/root-app.yaml
```

---

## ☁️ Sprint 5: AWS Production

**Login to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

**Push Images**
```bash
make push
```

**Update Kubeconfig**
```bash
aws eks update-kubeconfig --region us-east-1 --name ecommerce-cluster
```

---

## 🔍 Troubleshooting

**"Port already in use"**
```bash
lsof -i :3001
kill -9 <PID>
```

**"Service not connecting to Mongo"**
Check if `mongo-url` secret is correct:
```bash
kubectl get secret mongodb-connection -n ecommerce -o yaml
```

**"ArgoCD not syncing"**
Check the Repo URL in `k8s/argocd/root-app.yaml` matches your fork.
