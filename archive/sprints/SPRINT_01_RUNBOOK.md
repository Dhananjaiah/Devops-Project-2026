# Sprint 1 Runbook — Local Baseline + Quality Gates

Date: 2026-01-01

This runbook captures **what we implemented in Sprint 1** and the exact **commands to reproduce and verify** the Sprint 1 demo.

---

## Outcome (Sprint 1 Goal)
- One-command local start/stop
- Repeatable demo journey (register → login → create product → add to cart → create order)
- CI is **honest** (no “skip” masking for lint/tests/format)

---

## What changed (high level)

### 1) Demo automation
- Added end-to-end demo script: [scripts/demo.sh](../../scripts/demo.sh)
- Added smoke test wrapper: [scripts/test-services.sh](../../scripts/test-services.sh)
- Added demo evidence template: [course/DEMO_EVIDENCE_TEMPLATE.md](../DEMO_EVIDENCE_TEMPLATE.md)

### 2) Makefile improvements for reproducibility
- `make local` now rebuilds images so changes apply: [Makefile](../../Makefile)
- `make test` runs the journey script

### 3) Local MongoDB auth fixed (so local run actually works)
- Compose services now use credentialed `MONGO_URL` matching the Mongo container: [docker-compose.yaml](../../docker-compose.yaml)

### 4) CI is now honest
- Removed “skip/echo” patterns in CI and made checks real: [.github/workflows/ci.yaml](../../.github/workflows/ci.yaml)
- Added Node lint/test/format scripts and minimal tests:
  - [microservices/product-service/package.json](../../microservices/product-service/package.json)
  - [microservices/cart-service/package.json](../../microservices/cart-service/package.json)
- Made Node services testable (export app; don’t connect DB during tests):
  - [microservices/product-service/index.js](../../microservices/product-service/index.js)
  - [microservices/cart-service/index.js](../../microservices/cart-service/index.js)
- Added minimal pytest health tests:
  - [microservices/user-service/tests/test_health.py](../../microservices/user-service/tests/test_health.py)
  - [microservices/order-service/tests/test_health.py](../../microservices/order-service/tests/test_health.py)

---

## Commands we ran (Sprint 1)

### A) Bring up / tear down locally
From repo root:
```bash
make local
# (or) docker compose up -d --build

make local-logs

make local-down
# (or) docker compose down
```

### B) Run the full demo journey (this is the Sprint 1 “demo proof”)
```bash
bash scripts/demo.sh
```

### C) Run the same flow via the Make target
```bash
make test
```

### D) Rebuild + re-run after code/config changes
(We used this when we needed to ensure containers were rebuilt.)
```bash
make local-down
bash scripts/demo.sh
```

### E) Python formatting (to align with CI `black --check`)
If you want to reproduce the Python formatting we did (optional locally):
```bash
python3 -m pip install --user black==24.4.2 flake8==7.0.0 pylint==3.1.0 pytest==8.2.0 pytest-cov==5.0.0
export PATH="$HOME/.local/bin:$PATH"
black microservices/user-service microservices/order-service
```

---

## Sprint 1 verification checklist

### Demo checks
Run:
```bash
bash scripts/demo.sh
```
Expected:
- All health endpoints return 200
- The script prints:
  - `PASS: End-to-end journey completed`
  - the created `userId`, `productId`, `orderId`

### Manual health checks (optional)
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

---

## Notes / known limitations (intentionally left for Sprint 2)
- Kubernetes manifests still use unauthenticated `mongodb://mongodb:27017` and need alignment to credentials in Sprint 2 (ST-4).
- Readiness is still `/health`-based and does not check DB; `/ready` will be added in Sprint 2 (ST-5).
- Product ID handling was adjusted to make the local journey reliable; deeper ID consistency work is still part of Sprint 2 (ST-6).

