# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS Cloud (EKS)                         │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Application Load Balancer                 │ │
│  │                    (Ingress)                           │ │
│  └───────────────────┬───────────────────────────────────┘ │
│                      │                                       │
│  ┌──────────────────┼───────────────────────────────────┐  │
│  │  Kubernetes Namespace: ecommerce                      │  │
│  │                  │                                     │  │
│  │  ┌───────────────┼───────────────────────────┐       │  │
│  │  │  Microservices Layer                      │       │  │
│  │  │               │                            │       │  │
│  │  │  ┌────────────┴──────────┐                │       │  │
│  │  │  │                       │                │       │  │
│  │  │  ▼                       ▼                ▼       │  │
│  │  │ ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ │ Product  │  │   User   │  │   Cart   │        │  │
│  │  │ │ Service  │  │ Service  │  │ Service  │        │  │
│  │  │ │ (Node.js)│  │ (Python) │  │ (Node.js)│        │  │
│  │  │ │ Port:3001│  │ Port:3002│  │ Port:3003│        │  │
│  │  │ └────┬─────┘  └────┬─────┘  └────┬─────┘        │  │
│  │  │      │             │             │               │  │
│  │  │      └─────────────┼─────────────┘               │  │
│  │  │                    │                             │  │
│  │  │  ┌─────────────────▼────────────┐               │  │
│  │  │  │      Order Service            │               │  │
│  │  │  │       (Python/Flask)          │               │  │
│  │  │  │        Port: 3004             │               │  │
│  │  │  └───────────┬───────────────────┘               │  │
│  │  └──────────────┼───────────────────────────────────┘  │
│  │                 │                                       │
│  │  ┌──────────────▼───────────────────────────────────┐ │
│  │  │         Database Layer                           │ │
│  │  │                                                   │ │
│  │  │  ┌────────────────────────────────┐             │ │
│  │  │  │         MongoDB                │             │ │
│  │  │  │      (Document Store)          │             │ │
│  │  │  │        Port: 27017             │             │ │
│  │  │  └────────────────────────────────┘             │ │
│  │  └──────────────────────────────────────────────────┘ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Product Service (Node.js + Express)
- **Responsibility**: Manage product catalog
- **Database**: MongoDB
- **Endpoints**:
  - CRUD operations for products
  - Product search and filtering
- **Technology**: Node.js, Express, MongoDB driver

### 2. User Service (Python + Flask)
- **Responsibility**: User authentication and profile management
- **Database**: MongoDB
- **Endpoints**:
  - User registration
  - User login (JWT authentication)
  - Profile management
- **Technology**: Python, Flask, PyMongo, bcrypt, JWT

### 3. Cart Service (Node.js + Express)
- **Responsibility**: Shopping cart management
- **Database**: MongoDB
- **Dependencies**: Product Service (for product validation)
- **Endpoints**:
  - Add/remove items from cart
  - Update cart item quantities
  - Get cart details
- **Technology**: Node.js, Express, MongoDB driver, Axios

### 4. Order Service (Python + Flask)
- **Responsibility**: Order processing and management
- **Database**: MongoDB
- **Dependencies**: 
  - Cart Service (to fetch cart items)
  - Product Service (to get product details and prices)
- **Endpoints**:
  - Create orders from cart
  - Update order status
  - Get order history
- **Technology**: Python, Flask, PyMongo, Requests

## Data Flow

### Order Creation Flow:
```
1. User adds items to cart → Cart Service
2. Cart Service validates products → Product Service
3. User creates order → Order Service
4. Order Service:
   - Fetches cart items → Cart Service
   - Gets product details and prices → Product Service
   - Creates order in database
   - Clears cart → Cart Service
5. Order confirmation returned to user
```

## Deployment Architecture

### AWS EKS Components:
- **EKS Cluster**: Managed Kubernetes cluster
- **Node Groups**: EC2 instances running containerized applications
- **ALB**: Application Load Balancer for external traffic
- **EBS Volumes**: For persistent storage (if needed)

### Kubernetes Resources:
- **Namespace**: `ecommerce` - logical separation
- **Deployments**: 2 replicas per service for high availability
- **Services**: ClusterIP services for internal communication
- **Ingress**: ALB Ingress Controller for external access
- **ConfigMaps**: Environment configuration
- **Secrets**: Sensitive data (JWT keys, DB passwords)

## Communication Patterns

### Inter-Service Communication:
- **Synchronous**: REST APIs over HTTP
- **Service Discovery**: Kubernetes DNS (service-name.namespace.svc.cluster.local)
- **Load Balancing**: Kubernetes Service load balancing

### External Communication:
- **Ingress**: AWS Application Load Balancer
- **Path-based routing**: Different paths route to different services
- **HTTPS**: Can be configured with TLS certificates

## Scalability

### Horizontal Scaling:
- Each service can scale independently
- Kubernetes HPA (Horizontal Pod Autoscaler) can be configured
- Database can be scaled with MongoDB replica sets

### Performance Considerations:
- **Resource Limits**: CPU and memory limits defined
- **Health Checks**: Liveness and readiness probes
- **Connection Pooling**: MongoDB connections reused

## Security Measures

1. **Network Isolation**: Services in separate namespace
2. **Secrets Management**: Kubernetes Secrets for sensitive data
3. **Authentication**: JWT-based authentication in User Service
4. **Authorization**: Token validation for protected endpoints
5. **Password Security**: bcrypt hashing for passwords
6. **Network Policies**: Can be implemented for pod-to-pod communication

## Monitoring & Observability

### Health Checks:
- `/health` endpoint on each service
- Liveness and readiness probes configured

### Logging:
- Container logs accessible via `kubectl logs`
- Can be integrated with CloudWatch or ELK stack

### Metrics:
- Can integrate Prometheus for metrics collection
- Grafana for visualization

## Future Enhancements

1. **Caching Layer**: Redis for frequently accessed data
2. **Message Queue**: SQS/RabbitMQ for async processing
3. **API Gateway**: Centralized API management
4. **Service Mesh**: Istio for advanced traffic management
5. **Database Replication**: MongoDB replica sets for HA
6. **CDN**: CloudFront for static content delivery
