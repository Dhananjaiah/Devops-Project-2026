# Sprint 5 Runbook — AWS staging + CI/CD (GitOps-driven)

Date: 2026-01-01

This runbook is the **step-by-step execution guide** for Sprint 5.

Status in this repo (as of this date):
- Terraform exists under [terraform/](../../terraform/)
- A CD workflow exists, but the full “GitOps-driven staging deploy” is not yet implemented end-to-end in this workspace.

---

## Outcome (Sprint 5 Goal)
- Staging EKS provisioned via Terraform
- CI builds/pushes images with deterministic tags
- CI updates GitOps repo image tags
- ArgoCD deploys staging
- Smoke tests run against the gateway URL and hit valid endpoints

---

## Prereqs
- AWS account + permissions
- `aws`, `kubectl`, `terraform`, `helm`

---

## A) Provision staging EKS (Terraform)
From repo root:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Confirm cluster access:
```bash
kubectl get nodes
```

---

## B) Install platform add-ons (as per your architecture)
Examples (adjust based on your chosen add-ons):
- ArgoCD
- Envoy Gateway (Gateway API controller)
- Monitoring stack

---

## C) Build + push images
Expected behavior for Sprint 5:
- Each service image is tagged with the Git SHA (or a deterministic version)
- Images are pushed to ECR

Example (conceptual):
```bash
# CI should do this
# docker build -t <ecr>/product-service:<sha> ...
# docker push <ecr>/product-service:<sha>
```

---

## D) GitOps-driven deploy
Expected behavior for Sprint 5:
- CI commits updated image tags to the GitOps repo (staging overlay)
- ArgoCD auto-syncs (or sync is triggered) and deploys to EKS

Verification:
```bash
kubectl -n ecommerce get pods
```

---

## E) Smoke tests (against gateway)
Smoke tests should hit **real** endpoints that exist. Examples:
```bash
curl -fsS http://<gateway-host>/api/products
curl -fsS http://<gateway-host>/health
```

---

## Evidence to capture
- Terraform outputs + `kubectl get nodes`
- CI run showing image tags + push
- GitOps repo commit (tag bump)
- ArgoCD app status (Healthy/Synced)
- Smoke test output

---

## Files referenced
- Terraform: [terraform/](../../terraform/)
- CD workflow: [.github/workflows/cd.yaml](../../.github/workflows/cd.yaml)
