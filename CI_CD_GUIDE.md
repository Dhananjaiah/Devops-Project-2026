# CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the E-Commerce Microservices project.

---

## CI Pipeline (.github/workflows/ci.yaml)

The CI pipeline runs on every pull request and push to main/develop branches.

### Pipeline Stages

#### 1. Lint and Test Node.js Services
- **Services**: Product Service, Cart Service
- **Steps**:
  - Checkout code
  - Setup Node.js 18
  - Install dependencies with npm ci
  - Run linting (if configured)
  - Run tests (if configured)
  - Check code formatting

#### 2. Lint and Test Python Services
- **Services**: User Service, Order Service
- **Steps**:
  - Checkout code
  - Setup Python 3.9
  - Install dependencies
  - Run flake8 linting
  - Run pylint
  - Check black formatting
  - Run pytest with coverage

#### 3. Build Docker Images
- **All Services**: Product, User, Cart, Order
- **Steps**:
  - Build Docker images
  - Use BuildKit for caching
  - Test image builds

#### 4. Security Scanning
- **Tool**: Trivy
- **Scan Type**: Filesystem scanning
- **Output**: SARIF format to GitHub Security tab
- **Scans**: All 4 microservices

#### 5. Validate Kubernetes Manifests
- **Tool**: kubeval
- **Validates**: All YAML files in k8s/ directory
- **Checks**: Kubernetes API compatibility

---

## CD Pipeline (.github/workflows/cd.yaml)

The CD pipeline runs on pushes to main branch and version tags.

### Pipeline Stages

#### 1. Build and Push to ECR
- **Trigger**: Push to main or version tags (v*)
- **Steps**:
  - Login to Amazon ECR
  - Build Docker images
  - Tag images:
    - Branch name
    - Git SHA
    - Semantic version (for tags)
    - latest (for main branch)
  - Push to ECR

#### 2. Deploy to Staging
- **Trigger**: After successful build
- **Environment**: staging
- **Steps**:
  - Update kubeconfig
  - Update image tags in manifests
  - Deploy to Kubernetes (all resources)
  - Wait for rollout completion
  - Run smoke tests

#### 3. Deploy to Production
- **Trigger**: Version tags only (v*)
- **Environment**: production
- **Requires**: Manual approval
- **Strategy**: Blue-Green Deployment
- **Steps**:
  - Label current deployment as "blue"
  - Deploy new version as "green"
  - Wait for green deployment
  - Run production smoke tests
  - Switch traffic to green
  - Label green as production

#### 4. Automatic Rollback
- **Trigger**: Deployment failure
- **Action**: Rollback to previous version
- **Notification**: Deployment failure alert

---

## Required Secrets

Configure these secrets in GitHub repository settings:

```bash
AWS_ACCESS_KEY_ID        # AWS access key for deployment
AWS_SECRET_ACCESS_KEY    # AWS secret key for deployment
AWS_ACCOUNT_ID           # AWS account ID for ECR
AWS_REGION               # AWS region (default: us-east-1)
```

---

## Deployment Strategy

### Blue-Green Deployment

**Benefits**:
- Zero-downtime deployments
- Easy rollback
- Reduced risk

**Process**:
1. Current production = "blue"
2. Deploy new version = "green"
3. Test green deployment
4. Switch traffic to green
5. Keep blue for quick rollback

**Rollback**:
- Automatic on failure
- Manual via kubectl rollout undo

---

## Monitoring Integration

### Metrics Collection
- Prometheus ServiceMonitors for all services
- Metrics endpoint: /metrics
- Collection interval: 30 seconds

### Alerts
Configured alerts:
- ServiceDown (5 minutes)
- HighErrorRate (>5%)
- HighResponseTime (>1 second)
- HighMemoryUsage (>90%)
- HighCPUUsage (>80%)
- PodCrashLooping

### Grafana Dashboards
- E-Commerce Overview Dashboard
- Request rates, error rates, response times
- CPU and memory usage
- Pod counts

---

## Usage Examples

### Trigger CI Pipeline
```bash
# On pull request
git checkout -b feature/my-feature
git commit -m "Add feature"
git push origin feature/my-feature
# Create pull request

# CI pipeline runs automatically
```

### Trigger Staging Deployment
```bash
# Merge to main
git checkout main
git merge feature/my-feature
git push origin main

# CD pipeline deploys to staging automatically
```

### Trigger Production Deployment
```bash
# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# CD pipeline:
# 1. Deploys to staging
# 2. Waits for manual approval
# 3. Deploys to production with blue-green
```

### Manual Rollback
```bash
# If automatic rollback fails
kubectl rollout undo deployment/product-service -n ecommerce
kubectl rollout undo deployment/user-service -n ecommerce
kubectl rollout undo deployment/cart-service -n ecommerce
kubectl rollout undo deployment/order-service -n ecommerce
```

---

## Testing the Pipeline

### Local Testing

#### Test Docker Builds
```bash
# Build all images
make build

# Test individual service
docker build -t product-service:test ./microservices/product-service
docker run --rm product-service:test
```

#### Test Kubernetes Manifests
```bash
# Install kubeval
wget https://github.com/instrumenta/kubeval/releases/latest/download/kubeval-linux-amd64.tar.gz
tar xf kubeval-linux-amd64.tar.gz
sudo mv kubeval /usr/local/bin

# Validate manifests
find k8s -name "*.yaml" -type f | xargs kubeval
```

#### Test Security Scanning
```bash
# Install Trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy

# Scan services
trivy fs ./microservices/product-service
trivy fs ./microservices/user-service
trivy fs ./microservices/cart-service
trivy fs ./microservices/order-service
```

---

## Troubleshooting

### CI Pipeline Failures

**Build Failures**:
```bash
# Check build logs in GitHub Actions
# Fix dependency issues
npm ci  # for Node.js
pip install -r requirements.txt  # for Python
```

**Test Failures**:
```bash
# Run tests locally
cd microservices/product-service
npm test

cd microservices/user-service
pytest -v
```

**Security Scan Failures**:
```bash
# Review Trivy results
# Update vulnerable dependencies
npm audit fix  # for Node.js
pip install --upgrade package-name  # for Python
```

### CD Pipeline Failures

**ECR Push Failures**:
```bash
# Check AWS credentials
aws ecr get-login-password --region us-east-1

# Verify ECR repositories exist
aws ecr describe-repositories --region us-east-1
```

**Deployment Failures**:
```bash
# Check cluster access
kubectl cluster-info

# Check pod status
kubectl get pods -n ecommerce

# View deployment logs
kubectl logs -f deployment/product-service -n ecommerce
```

**Smoke Test Failures**:
```bash
# Check service endpoints
kubectl get ingress -n ecommerce

# Test endpoints manually
curl http://LB_URL/api/products/health
```

---

## Best Practices

### 1. Version Tagging
```bash
# Use semantic versioning
v1.0.0  # Major.Minor.Patch
v1.0.1  # Patch release
v1.1.0  # Minor release
v2.0.0  # Major release
```

### 2. Commit Messages
```bash
# Use conventional commits
feat: Add new feature
fix: Fix bug
docs: Update documentation
chore: Update dependencies
ci: Update CI pipeline
```

### 3. Pull Requests
- Create PR for all changes
- Wait for CI to pass
- Get code review approval
- Merge to main

### 4. Deployment Schedule
- Staging: Continuous (every merge)
- Production: Scheduled windows or tags
- Avoid Friday deployments

### 5. Monitoring
- Check Grafana dashboards after deployment
- Monitor alerts in first 30 minutes
- Be ready to rollback

---

## Future Enhancements

### Planned Improvements
1. **Automated Tests**: Add unit and integration tests
2. **Code Coverage**: Enforce 80%+ coverage
3. **Performance Tests**: Load testing in CI
4. **Canary Deployments**: Gradual rollout
5. **GitOps**: ArgoCD integration
6. **Multi-Region**: Deploy to multiple regions

---

**Last Updated**: 2026-01-01  
**Maintained By**: DevOps Team
