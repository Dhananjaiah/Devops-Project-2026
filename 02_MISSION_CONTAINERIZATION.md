# 📦 Mission 2: Containerization & Cloud Ready

**Role:** DevOps Engineer
**Objective:** Prepare the application for the cloud by ensuring images are production-ready and pushed to a registry.

---

## 2.1 The Scenario
Now that it runs locally, we need to move it to AWS. The first step is getting our Docker images out of your laptop and into a shared registry (AWS ECR).

**Your Goal:**
1.  Audit the `Dockerfiles`.
2.  Set up AWS ECR repositories.
3.  Tag and Push images.

---

## 2.2 Audit the Dockerfiles
Look at `microservices/product-service/Dockerfile`.

```dockerfile
# We use Multi-Stage Builds to keep images small
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD ["npm", "start"]
```
*   **Alpine Linux**: Small security surface.
*   **Multi-stage**: We don't ship build tools to production.

---

## 2.3 Setup AWS Resources (ECR)
You need to create 4 repositories in AWS Elastic Container Registry (ECR).

```bash
# Ensure AWS CLI is configured
aws sts get-caller-identity

# Create Repos (Run one by one)
aws ecr create-repository --repository-name product-service --region us-east-1
aws ecr create-repository --repository-name user-service --region us-east-1
aws ecr create-repository --repository-name cart-service --region us-east-1
aws ecr create-repository --repository-name order-service --region us-east-1
```

---

## 2.4 Build, Tag, and Push
We use a `Makefile` helper for this, but here is what happens under the hood.

**1. Login to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

**2. Push Everything**
```bash
# Ensure you set these variables first!
export AWS_ACCOUNT_ID=<your-account-id>
export AWS_REGION=us-east-1

make push
```

**Verification:**
Go to the AWS Console -> ECR. You should see all 4 repositories with the `latest` tag.

---

**[NEXT MISSION] -> 03_MISSION_KUBERNETES_LOCAL.md**
