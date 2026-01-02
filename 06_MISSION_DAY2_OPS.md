# 🛡️ Mission 6: Day 2 Operations (Observability & Security)

**Role:** SRE Lead
**Objective:** The app is live. Now we need to know **if it is healthy** and **keep it secure**.

---

## 6.1 The Scenario
"Production is live, but is it slow?"
We need **Metrics** (Prometheus) and **Dashboards** (Grafana).

**Your Goal:**
1.  Install the Observability Stack (Kube-Prometheus-Stack).
2.  Check the "Golden Signals" (Latency, Traffic, Errors, Saturation).
3.  Run a Security Audit.

---

## 6.2 Install Prometheus & Grafana
We use Helm for this.

```bash
# Add Helm Repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install
kubectl create namespace monitoring
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring
```

---

## 6.3 Access Grafana
```bash
# Get Password
kubectl get secret -n monitoring kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 --d ; echo

# Port Forward
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 -n monitoring
```

Open `http://localhost:3000`.
Check the **Kubernetes / Compute Resources / Namespace (Pods)** dashboard. You should see CPU/Memory usage for your `ecommerce` pods.

---

## 6.4 Security Audit (Trivy)
Scan your images for vulnerabilities.

```bash
# MacOS/Linux
brew install trivy

# Scan an image
trivy image <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/product-service:latest
```

**Task:** Fix any "Critical" vulnerabilities by updating the base image in `Dockerfile`.

---

## 🎓 Graduation
You have completed the **DevOps Production Course**.
1.  Onboarding (Local)
2.  Containerization (Docker)
3.  Orchestration (Kind)
4.  GitOps (ArgoCD)
5.  Cloud (AWS EKS)
6.  Observability (Prometheus)

**You are ready for the real world.**
