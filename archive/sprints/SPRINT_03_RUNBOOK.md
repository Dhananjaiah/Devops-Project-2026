# Sprint 3 Runbook — UI MVP (React + Node host)

Date: 2026-01-01

This runbook captures **what we implemented in Sprint 3** and the exact **commands to reproduce and verify** the Sprint 3 UI demo.

---

## Outcome (Sprint 3 Goal)
- UI completes the same journey as curl
- UI uses `/api/*` paths so it works behind Gateway API later
- One-command local start (`make local`) brings up UI + APIs

---

## What changed (high level)

### 1) New UI service
- Added Vite React UI: [microservices/ui/](../../microservices/ui/)
- UI talks to backend via `/api/*` (relative paths) so it works behind gateway routing.

### 2) Node-based UI hosting (production-style)
- UI container runs an Express server that:
  - serves the built SPA (`dist/`)
  - supports SPA client routing
  - proxies `/api/*` to the backend service containers

### 3) Compose wiring
- Added UI to local stack on port 8080: [docker-compose.yaml](../../docker-compose.yaml)

### 4) Demo checklist updated
- Sprint 3 demo steps include a CLI proof script that hits the same `/api/*` paths the browser uses: [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md)

---

## Commands we ran (Sprint 3)

### A) Start/stop the full stack (UI + APIs)
From repo root:
```bash
make local
# (or) docker compose up -d --build

make local-down
# (or) docker compose down
```

### B) Open the UI
- Browser: `http://localhost:8080`

### C) Smoke-check UI host + proxy
```bash
curl -I http://localhost:8080/
curl http://localhost:8080/api/products
```

### D) Full end-to-end journey through the UI proxy (CLI proof)
This validates register → login → create product → add to cart → place order → view orders via `http://localhost:8080/api/*`.

```bash
python3 - <<'PY'
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
PY
```

---

## Sprint 3 verification checklist
- `docker compose ps` shows `ui` running and `0.0.0.0:8080->8080/tcp`
- UI loads at `http://localhost:8080`
- UI can:
  - register/login
  - list/create products
  - add to cart/view cart
  - place order/view orders

---

## Troubleshooting

### `GET /api/orders?userId=...` returns 404
- Cause: strict routing when a proxy rewrites `/api/orders?x=y` into `/api/orders/?x=y`.
- Fix implemented in the UI proxy rewrite logic: [microservices/ui/server.js](../../microservices/ui/server.js)

### Port 8080 already in use
- Stop conflicting process or change the mapping in compose.

---

## Files touched in Sprint 3
- [microservices/ui/](../../microservices/ui/)
- [docker-compose.yaml](../../docker-compose.yaml)
- [Makefile](../../Makefile)
- [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md)
- [QUICKSTART.md](../../QUICKSTART.md)
