# Sprint 4: Walking Skeleton App – Code Session Outline

## Session Goal
Explain the microservices code structure to students. Focus on **DevOps-relevant** aspects, not business logic.

---

## Part 1: Architecture Overview (5 min)

```
┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Gateway   │
│   (React)   │     │   (Ingress) │
└─────────────┘     └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Product    │     │    Cart     │     │   Order     │
│  (Node.js)  │     │  (Node.js)  │     │  (Python)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                    ┌─────────────┐
                    │   MongoDB   │
                    └─────────────┘
```

**Talking Points:**
- 4 microservices (polyglot: Node.js + Python)
- Each service owns its domain (product catalog, cart, orders)
- All connect to MongoDB
- Frontend calls APIs via Ingress

---

## Part 2: Service Structure (10 min)

### Standard Service Layout
```
services/product/
├── src/
│   └── index.js          # Entry point
├── Dockerfile            # Multi-stage build
├── package.json          # Dependencies
└── README.md             # Local run instructions
```

### Key Files to Show:

#### 2.1 Health & Readiness Endpoints
```javascript
// /health - Is the process alive?
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// /ready - Can it serve traffic? (DB connected?)
app.get('/ready', async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not ready' });
  }
});
```

**Why this matters for DevOps:**
- Kubernetes uses `/health` for liveness probe (restart if fails)
- Kubernetes uses `/ready` for readiness probe (remove from LB if fails)

#### 2.2 Environment Variables
```javascript
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
```

**Why this matters for DevOps:**
- Config via env vars (12-factor app)
- Helm values inject these at deploy time

---

## Part 3: Dockerfile Deep Dive (10 min)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
USER appuser
EXPOSE 3001
CMD ["node", "src/index.js"]
```

**Talking Points:**
1. **Multi-stage build**: Build deps not in final image
2. **Alpine base**: Small image (<100MB)
3. **Non-root user**: Security best practice
4. **npm ci**: Reproducible installs (uses lock file)

---

## Part 4: Helm Chart Structure (10 min)

```
charts/product/
├── Chart.yaml
├── values.yaml           # Default values
├── values-dev.yaml       # Dev overrides
├── values-prod.yaml      # Prod overrides
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── _helpers.tpl
```

### Key Helm Concepts to Show:

#### Probes in deployment.yaml
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

#### Resource Limits
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi
```

---

## Part 5: Local Run Demo (5 min)

```bash
# Build and run locally
cd services/product
docker build -t product:local .
docker run -p 3001:3001 -e MONGO_URL=mongodb://host.docker.internal:27017 product:local

# Test
curl http://localhost:3001/health
curl http://localhost:3001/ready
```

---

## Summary Checklist for Students

- [ ] Each service has `/health` and `/ready`
- [ ] Dockerfile is multi-stage and runs as non-root
- [ ] Config is via environment variables
- [ ] Helm chart has probes and resource limits
- [ ] Local docker run works before pushing
