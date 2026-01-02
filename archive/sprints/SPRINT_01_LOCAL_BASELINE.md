# Sprint 1 — Local baseline + quality gates

**Sprint Goal:** Anyone can run locally and demo the journey reliably, with **honest** CI gates.

## Scope (Aligned to Jira)
- Epic 1: Course Foundation
  - ST-1 Local runbook + demo script
    - TASK ST-1.1 / ST-1.2 / ST-1.3
- Epic 9: CI/CD
  - ST-2 Make CI honest
    - TASK ST-2.1 / ST-2.2

## Runbook
- [course/sprints/SPRINT_01_RUNBOOK.md](SPRINT_01_RUNBOOK.md)

## Current repo status (starting point)
- Local run: [docker-compose.yaml](../../docker-compose.yaml), [Makefile](../../Makefile), [QUICKSTART.md](../../QUICKSTART.md)
- CI currently skips lint/tests/format: [.github/workflows/ci.yaml](../../.github/workflows/ci.yaml)

## Deliverables
- A repeatable local demo script:
  - `make local`
  - health checks
  - full journey script (register → login → create product → add to cart → create order)
  - `make local-down`
- CI pipelines that **fail** when:
  - lint is not configured
  - tests are missing
  - formatting checks fail

## Implementation checklist (what to change)
1) **Add demo automation**
- Create `scripts/demo.sh` to run:
  - `make local`
  - wait until services healthy
  - run curl journey from [QUICKSTART.md](../../QUICKSTART.md)
  - print a final “PASS” summary

2) **Make CI honest**
- Update [.github/workflows/ci.yaml](../../.github/workflows/ci.yaml):
  - remove `|| echo "...skipping"` patterns
  - ensure `npm run lint`, `npm test`, `npm run format:check` exist or CI fails
  - ensure Python tests exist or CI fails

3) **CI: Docker smoke test sanity**
- Remove/replace the `docker run ... --version` step if images don’t provide that.

## Verification (Definition of Done)
- Local:
  - `make local` works
  - `curl http://localhost:3001/health` returns 200
  - `curl http://localhost:3002/health` returns 200
  - `curl http://localhost:3003/health` returns 200
  - `curl http://localhost:3004/health` returns 200
  - `scripts/demo.sh` returns exit code 0

- CI:
  - PR with a lint error fails
  - PR with failing test fails
  - “missing lint” is not silently ignored

## Demo script (Sprint Review)
Use [course/SPRINT_REVIEW_DEMO_CHECKLIST.md](../SPRINT_REVIEW_DEMO_CHECKLIST.md) → Sprint 1.

## Risks / notes
- Mongo auth consistency is tracked for Sprint 2 (ST-4). Don’t spend Sprint 1 time re-architecting DB auth unless it blocks the demo.
