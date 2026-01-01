# E-Commerce Microservices on AWS EKS

A complete microservices-based e-commerce application deployed on AWS Elastic Kubernetes Service (EKS).

## Architecture

This application consists of 4 microservices:

1. **Product Service** (Node.js) - Manages product catalog
2. **User Service** (Python/Flask) - Handles user authentication and profiles
3. **Cart Service** (Node.js) - Manages shopping carts
4. **Order Service** (Python/Flask) - Processes and tracks orders

All services use MongoDB as the database and communicate via REST APIs.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- kubectl installed
- eksctl installed
- Docker installed (for building images)

## Project Structure

```
.
├── microservices/
│   ├── product-service/    # Product management service (Node.js)
│   ├── user-service/        # User authentication service (Python)
│   ├── cart-service/        # Shopping cart service (Node.js)
│   └── order-service/       # Order processing service (Python)
├── k8s/
│   ├── namespaces/          # Kubernetes namespace definitions
│   ├── deployments/         # Service deployments
│   ├── services/            # Service exposures
│   ├── configmaps/          # Configuration and secrets
│   ├── ingress/             # Ingress configuration
│   └── databases/           # Database deployments
└── README.md
```

## Setup Instructions

### 1. Create EKS Cluster

```bash
# Create EKS cluster with eksctl
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

This will take 10-15 minutes. Once complete, your kubectl context will be automatically configured.

### 2. Install AWS Load Balancer Controller

```bash
# Install AWS Load Balancer Controller for Ingress
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"

# Create IAM policy and service account
eksctl create iamserviceaccount \
  --cluster=ecommerce-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess \
  --approve

# Install the controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=ecommerce-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

### 3. Build and Push Docker Images

First, create an ECR repository for each service:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name product-service --region us-east-1
aws ecr create-repository --repository-name user-service --region us-east-1
aws ecr create-repository --repository-name cart-service --region us-east-1
aws ecr create-repository --repository-name order-service --region us-east-1

# Build and push images
cd microservices/product-service
docker build -t product-service:latest .
docker tag product-service:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/product-service:latest
docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/product-service:latest

cd ../user-service
docker build -t user-service:latest .
docker tag user-service:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/user-service:latest
docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/user-service:latest

cd ../cart-service
docker build -t cart-service:latest .
docker tag cart-service:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/cart-service:latest
docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/cart-service:latest

cd ../order-service
docker build -t order-service:latest .
docker tag order-service:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/order-service:latest
docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/order-service:latest
```

**Note:** Update the image references in the deployment YAML files with your ECR repository URLs.

### 4. Deploy to EKS

```bash
# Create namespace
kubectl apply -f k8s/namespaces/ecommerce-namespace.yaml

# Deploy database
kubectl apply -f k8s/databases/mongodb.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n ecommerce --timeout=120s

# Deploy ConfigMaps and Secrets
kubectl apply -f k8s/configmaps/

# Deploy microservices
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/

# Deploy Ingress
kubectl apply -f k8s/ingress/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check all resources
kubectl get all -n ecommerce

# Check pods are running
kubectl get pods -n ecommerce

# Check services
kubectl get svc -n ecommerce

# Get Ingress URL
kubectl get ingress -n ecommerce
```

## API Endpoints

Once deployed, access the services through the Ingress ALB:

### Product Service (Port 3001)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### User Service (Port 3002)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (requires auth)

### Cart Service (Port 3003)
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:productId` - Update cart item
- `DELETE /api/cart/:userId/items/:productId` - Remove cart item
- `DELETE /api/cart/:userId` - Clear cart

### Order Service (Port 3004)
- `GET /api/orders` - List orders (with ?userId= filter)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order from cart
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## Testing the Application

```bash
# Get the ALB DNS name
export ALB_URL=$(kubectl get ingress ecommerce-ingress -n ecommerce -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Test product service
curl http://$ALB_URL/api/products

# Test user registration
curl -X POST http://$ALB_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test health endpoints
curl http://$ALB_URL/api/products/../health
```

## Monitoring and Logs

```bash
# View logs for a service
kubectl logs -f deployment/product-service -n ecommerce

# View logs for all pods in namespace
kubectl logs -l app=product-service -n ecommerce --tail=100

# Describe a pod
kubectl describe pod <pod-name> -n ecommerce
```

## Scaling

```bash
# Scale a deployment
kubectl scale deployment product-service --replicas=5 -n ecommerce

# Enable autoscaling
kubectl autoscale deployment product-service --cpu-percent=70 --min=2 --max=10 -n ecommerce
```

## Security Considerations

1. **Update Secrets**: Change the default JWT secret and MongoDB password in `k8s/databases/mongodb.yaml` and `k8s/configmaps/app-secrets.yaml`
2. **Network Policies**: Implement network policies to restrict pod-to-pod communication
3. **RBAC**: Configure proper role-based access control
4. **TLS**: Add TLS certificates to the Ingress for HTTPS (see ingress.yaml comments)
5. **Image Scanning**: Scan Docker images for vulnerabilities before deployment
6. **Rate Limiting**: Add rate limiting middleware (e.g., express-rate-limit for Node.js) to prevent abuse
7. **Input Validation**: Add comprehensive input validation for all API endpoints

## Clean Up

To delete all resources:

```bash
# Delete Kubernetes resources
kubectl delete namespace ecommerce

# Delete EKS cluster
eksctl delete cluster --name ecommerce-cluster --region us-east-1

# Delete ECR repositories
aws ecr delete-repository --repository-name product-service --force --region us-east-1
aws ecr delete-repository --repository-name user-service --force --region us-east-1
aws ecr delete-repository --repository-name cart-service --force --region us-east-1
aws ecr delete-repository --repository-name order-service --force --region us-east-1
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n ecommerce
kubectl logs <pod-name> -n ecommerce
```

### Service connectivity issues
```bash
kubectl get endpoints -n ecommerce
kubectl exec -it <pod-name> -n ecommerce -- curl http://product-service:3001/health
```

### Ingress not working
```bash
kubectl describe ingress ecommerce-ingress -n ecommerce
kubectl logs -n kube-system deployment/aws-load-balancer-controller
```

## Agile Sprint Planning

This project follows Agile methodology with 2-week sprints. We have comprehensive sprint planning to guide the development and deployment process.

### Sprint Documentation
- **[SPRINTS.md](SPRINTS.md)** - Detailed sprint planning for all 6 sprints (Weeks 1-12)
- **[BACKLOG.md](BACKLOG.md)** - Product backlog with user stories and priorities
- **[AGILE_GUIDE.md](AGILE_GUIDE.md)** - Quick reference guide for Agile ceremonies and processes
- **Sprint Tracking** - Individual sprint files in `.github/sprints/`

### Sprint Overview
1. **Sprint 1** (Weeks 1-2): Foundation & Infrastructure Setup
2. **Sprint 2** (Weeks 3-4): Microservices Development
3. **Sprint 3** (Weeks 5-6): Kubernetes Configuration & Database Setup
4. **Sprint 4** (Weeks 7-8): Deployment & Integration Testing
5. **Sprint 5** (Weeks 9-10): Security, Optimization & Production Readiness
6. **Sprint 6** (Weeks 11-12): CI/CD Pipeline & Automation

**Total Story Points**: 209 SP across 6 sprints

For detailed sprint information, user stories, and tasks, see [SPRINTS.md](SPRINTS.md).

## Future Enhancements

- Add Redis for caching
- Implement message queue (RabbitMQ/SQS) for async processing
- Add monitoring with Prometheus and Grafana
- Implement distributed tracing with Jaeger
- Add CI/CD pipeline with GitHub Actions
- Implement API Gateway
- Add rate limiting and API throttling

## License

MIT License
