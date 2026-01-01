# Quick Start Guide

This guide will help you get the E-Commerce Microservices application running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [docker-compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Node.js](https://nodejs.org/) (version 18+) - for local development
- [Python](https://www.python.org/) (version 3.9+) - for local development

## Quick Start - Local Development (5 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/Dhananjaiah/Devops-Project-2026.git
cd Devops-Project-2026
```

### 2. Start All Services with Docker Compose
```bash
make local
# OR
docker-compose up -d
```

This will start:
- MongoDB database on port 27017
- Product Service on port 3001
- User Service on port 3002
- Cart Service on port 3003
- Order Service on port 3004
- UI (React, served by Node) on port 8080

### 3. Wait for Services to Start (30 seconds)
```bash
# Check if all containers are running
docker-compose ps
```

### 4. Test the Application

#### Course demo (recommended)
Run the full end-to-end journey script:
```bash
bash scripts/demo.sh
```

Or run the same flow via the Make target:
```bash
make test
```

#### Health Checks
```bash
# Test Product Service
curl http://localhost:3001/health

# Test User Service
curl http://localhost:3002/health

# Test Cart Service
curl http://localhost:3003/health

# Test Order Service
curl http://localhost:3004/health

# UI (served by Node)
curl -I http://localhost:8080/
```

#### Complete User Journey Test

**Step 1: Register a User**
```bash
curl -X POST http://localhost:3002/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Step 2: Login to Get Token**
```bash
curl -X POST http://localhost:3002/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Save the token from the response!

**Step 3: Create a Product**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50
  }'
```
Save the product ID from the response!

**Step 4: Add Product to Cart**
```bash
# Replace USER_ID with the user ID from Step 1
# Replace PRODUCT_ID with the product ID from Step 3
curl -X POST http://localhost:3003/api/cart/USER_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

**Step 5: View Cart**
```bash
curl http://localhost:3003/api/cart/USER_ID
```

**Step 6: Create Order**
```bash
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

**Step 7: View Order**
```bash
curl http://localhost:3004/api/orders?userId=USER_ID
```

### 5. View Logs
```bash
# View all logs
make local-logs
# OR
docker-compose logs -f

# View specific service logs
docker-compose logs -f product-service
docker-compose logs -f user-service
docker-compose logs -f cart-service
docker-compose logs -f order-service
```

### 6. Stop Services
```bash
make local-down
# OR
docker-compose down
```

---

## Production Deployment - AWS EKS

For production deployment on AWS EKS, follow these steps:

### Prerequisites
- AWS Account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) configured
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [eksctl](https://eksctl.io/) installed

### Quick Deployment Steps

1. **Create EKS Cluster**
   ```bash
   eksctl create cluster \
     --name ecommerce-cluster \
     --region us-east-1 \
     --nodegroup-name standard-workers \
     --node-type t3.medium \
     --nodes 3 \
     --nodes-min 2 \
     --nodes-max 4 \
     --managed
   ```

2. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name product-service --region us-east-1
   aws ecr create-repository --repository-name user-service --region us-east-1
   aws ecr create-repository --repository-name cart-service --region us-east-1
   aws ecr create-repository --repository-name order-service --region us-east-1
   ```

3. **Build and Push Docker Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   
   # Build images
   make build
   
   # Tag and push (update ACCOUNT_ID)
   docker tag product-service:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/product-service:latest
   docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/product-service:latest
   # ... repeat for other services
   ```

4. **Update Kubernetes Manifests**
   Update the image references in `k8s/deployments/*.yaml` with your ECR URLs.

5. **Deploy to EKS**
   ```bash
   make deploy
   # OR
   kubectl apply -f k8s/namespaces/
   kubectl apply -f k8s/databases/
   kubectl apply -f k8s/configmaps/
   kubectl apply -f k8s/deployments/
   kubectl apply -f k8s/services/
   kubectl apply -f k8s/ingress/
   ```

6. **Verify Deployment**
   ```bash
   kubectl get all -n ecommerce
   kubectl get ingress -n ecommerce
   ```

For detailed instructions, see [README.md](README.md).

---

## Troubleshooting

### Services Not Starting
```bash
# Check container logs
docker-compose logs product-service

# Check if MongoDB is ready
docker-compose logs mongodb

# Restart services
docker-compose restart
```

### Connection Refused Errors
```bash
# Ensure MongoDB is running
docker-compose ps mongodb

# Wait for MongoDB to be fully ready (can take 30 seconds)
sleep 30
docker-compose restart product-service user-service cart-service order-service
```

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3001

# Stop any conflicting services or change ports in docker-compose.yaml
```

### Clear Data and Start Fresh
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Start again
docker-compose up -d
```

---

## Next Steps

1. **Explore the APIs**: See [README.md](README.md) for complete API documentation
2. **Check Sprint Status**: See [SPRINT_COMPLETION.md](SPRINT_COMPLETION.md) for project progress
3. **Read Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
4. **Deploy to Production**: Follow the EKS deployment guide in [README.md](README.md)

---

## Getting Help

- **Documentation**: Check [README.md](README.md) for comprehensive documentation
- **Service READMEs**: Each microservice has its own README in `microservices/<service>/README.md`
- **Issues**: Report issues on the GitHub repository
- **Logs**: Always check logs first using `docker-compose logs` or `kubectl logs`

---

## Useful Commands

```bash
# Build Docker images
make build

# Start local development
make local

# Stop local development
make local-down

# View logs
make local-logs

# Deploy to Kubernetes
make deploy

# Check Kubernetes status
make status

# Clean up Kubernetes resources
make clean
```

---

**Quick Links:**
- [Main README](README.md) - Complete documentation
- [SPRINT_COMPLETION.md](SPRINT_COMPLETION.md) - Sprint tracking and progress
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [SPRINTS.md](SPRINTS.md) - Sprint planning details
- [BACKLOG.md](BACKLOG.md) - Product backlog

Happy coding! 🚀
