# ☁️ Mission 5: Going Global (AWS Cloud)

**Role:** Cloud Architect
**Objective:** Migrate the application from local Kind to a real AWS EKS cluster.

---

## 5.1 The Scenario
Localhost is fun, but customers can't access it. We need to deploy to **AWS**.
We will use **EKS** (Elastic Kubernetes Service).

**Your Goal:**
1.  Provision Infrastructure (EKS) using Terraform (or `eksctl`).
2.  Configure `kubectl` to talk to AWS.
3.  Update ArgoCD to deploy to EKS.

---

## 5.2 Provision EKS
We have provided Terraform scripts in `terraform/`, but for this sprint, we'll use `eksctl` for speed.

```bash
# Create Cluster (Takes ~15 mins)
eksctl create cluster \
  --name ecommerce-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2
```

**Verify:**
```bash
kubectl get nodes
# Should show ip-xyz.ec2.internal nodes
```

---

## 5.3 Connect ArgoCD to EKS
You have two choices:
1.  **Install ArgoCD on EKS** (Standard Pattern).
2.  **Run ArgoCD Locally** and point it to EKS (Dev Pattern).

Let's do the **Standard Pattern**.

```bash
# Switch context to EKS
aws eks update-kubeconfig --region us-east-1 --name ecommerce-cluster

# Install ArgoCD on EKS
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

---

## 5.4 Deploy the App
Apply the GitOps root app again.

```bash
kubectl apply -f k8s/argocd/root-app.yaml
```

ArgoCD will now pull your images from ECR (which you pushed in Mission 2) and run them on AWS.

**Critical Step:**
Ensure your Kubernetes deployments refer to the **ECR Image URIs**, not just `product-service:latest`.
Update `k8s/deployments/*.yaml` with your `<AWS_ACCOUNT_ID>.dkr.ecr...` image paths and commit to Git. ArgoCD will pick up the change.

---

**[NEXT MISSION] -> 06_MISSION_DAY2_OPS.md**
