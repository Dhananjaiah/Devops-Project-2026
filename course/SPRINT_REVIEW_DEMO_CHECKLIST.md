# Sprint Review Demo Checklist (Course)

Use this as your repeatable sprint-review script. Each sprint demo should take **<10 minutes**.

## Sprint 1 — Local baseline + quality gates
- Start: `make local`
- Show containers: `docker compose ps`
- Health checks:
  - `curl http://localhost:3001/health`
  - `curl http://localhost:3002/health`
  - `curl http://localhost:3003/health`
  - `curl http://localhost:3004/health`
- Run end-to-end journey (script or manual): register → login → create product → add to cart → create order
- Show logs: `make local-logs` (briefly)
- Stop: `make local-down`

## Sprint 2 — Backend hardening (prod behaviors)
- Prove Mongo/auth consistency:
  - Show services connect using credentials (compose + k8s manifests aligned)
- Prove dependency-aware readiness:
  - Break DB connectivity (stop Mongo or block it) and show readiness fails / service refuses traffic
- Prove ID correctness:
  - Create product → fetch by id → add to cart → order successfully

## Sprint 3 — UI MVP (React + Node host)
- Start everything with one command (compose)
- UI demo:
  - Register + login
  - Product list + create product
  - Add product to cart, view cart
  - Place order, view orders
- Show UI container is Node-based (frontend service) and is hitting APIs correctly

Optional (CLI proof, uses the same path the browser uses):
- Confirm UI is up: `curl -I http://localhost:8080/`
- Confirm proxy works (example): `curl http://localhost:8080/api/products`
- Run full journey through UI proxy (register → login → product → cart → order):
  - `python3 - <<'PY'
import json, time
from urllib.request import Request, urlopen
from urllib.parse import urlencode

BASE = 'http://localhost:8080'
email = f"demo+{int(time.time())}@example.com"
password = 'password123'

def post(path, payload):
    data = json.dumps(payload).encode('utf-8')
    req = Request(BASE + path, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

def get(path):
    req = Request(BASE + path, method='GET')
    with urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

_, reg = post('/api/users/register', {'email': email, 'password': password, 'name': 'Demo User'})
user_id = reg['id']
post('/api/users/login', {'email': email, 'password': password})
_, prod = post('/api/products', {'name': 'UI Demo Product', 'description': 'Created via UI proxy', 'price': 12.34, 'category': 'Demo', 'stock': 5})
product_id = prod.get('id') or prod.get('_id')
post(f'/api/cart/{user_id}/items', {'productId': product_id, 'quantity': 2})
post('/api/orders', {'userId': user_id, 'shippingAddress': {'street':'123 Main St','city':'New York','state':'NY','zipCode':'10001','country':'USA'}})
_, orders = get('/api/orders?' + urlencode({'userId': user_id}))
print('OK: orders=', len(orders))
PY`

## Sprint 4 — Prod-like local Kubernetes
- Bring up local k8s (kind/minikube) and apply manifests/overlay
- Show a single gateway host serves:
  - UI at `/`
  - APIs at `/api/*`
- Prove readiness/liveness behavior with rolling restart
- GitOps demo:
  - Show ArgoCD UI is reachable
  - Show App-of-Apps sync status for UI + services

## Sprint 5 — AWS staging + CI/CD
- Show pipeline trigger (merge to main)
- Show images pushed with a deterministic tag (SHA)
- Update GitOps repo image tags (CI step)
- ArgoCD sync deploys to EKS staging
- Run smoke tests against gateway URL
- Show rollback approach (documented + demonstrated if time)

## Sprint 6 — Production readiness (ops)
- HTTPS enabled on gateway and HTTP redirects to HTTPS
- Monitoring works for real:
  - Prometheus scraping succeeds
  - Grafana dashboard shows requests/errors/latency
- Backup + restore drill:
  - Run backup job
  - Restore into fresh DB
  - Verify data via API/UI
- GitOps promotion demo:
  - Create a release/tag or promotion PR that updates prod image tags
  - Show approval step (manual gate) then ArgoCD deploys to prod
