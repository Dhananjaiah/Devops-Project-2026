# 🦅 Mission 4: GitOps & Production Automation

**Role:** Senior SRE (Site Reliability Engineer)
**Objective:** Stop applying manifests manually (`kubectl apply`). Implement **GitOps** using ArgoCD.

---

## 4.1 The Scenario
In the last mission, you ran `kubectl apply` 5 times. If you change a file, you have to remember to apply it again.
In Production, **humans should not touch the cluster**.
The cluster should sync itself from Git.

**Your Goal:**
1.  Install ArgoCD.
2.  Deploy the "App of Apps" (The Root Application).
3.  Watch the cluster sync itself.

---

## 4.2 Install ArgoCD
We install ArgoCD into its own namespace.

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for it to wake up:
```bash
kubectl wait --for=condition=Available deployment/argocd-server -n argocd --timeout=300s
```

---

## 4.3 The "App of Apps" Pattern
Look at `k8s/argocd/root-app.yaml`.
This is a **Parent Application**. It tells ArgoCD: "Go look at the `k8s/argocd/applications` folder."
Inside that folder, there are Child Applications (Services, Database, Config).

**Deploy the Parent:**
```bash
kubectl apply -f k8s/argocd/root-app.yaml
```

---

## 4.4 Verify GitOps
ArgoCD will now:
1.  See the `root-app`.
2.  Read the `applications/` folder.
3.  Discover the children (`ecommerce-services`, `ecommerce-databases`).
4.  Deploy everything in the `k8s/` folder.

Check the implementation:
```bash
kubectl get applications -n argocd
```

You should see 4 applications: `ecommerce-root-app`, `ecommerce-services`, `ecommerce-databases`, `ecommerce-config`.
**All should be `Healthy` and `Synced`.**

---

## 4.5 The Production Dashboard
Access the ArgoCD UI to see your beautiful dependency graph.

1.  **Get the Password**
    ```bash
    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
    ```

2.  **Port Forward the UI**
    ```bash
    kubectl port-forward svc/argocd-server -n argocd 8080:443
    ```

3.  **Login**
    Open `https://localhost:8080` (Accept the security warning).
    User: `admin`
    Password: (The one you just got)

---

**🎉 CONGRATULATIONS!**
You have built a fully automated IDP (Internal Developer Platform).
1.  Code is committed to Git.
2.  ArgoCD sees the change.
3.  Kubernetes updates automatically.

This is **Production Grade DevOps**.
