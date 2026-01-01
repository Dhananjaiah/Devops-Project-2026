# UI (Sprint 3)

## Local dev (no Docker)
- From this folder: `npm install`
- Start Vite: `npm run dev`
- UI: http://localhost:8080

Vite proxies `/api/*` to the backend services (ports 3001-3004).

## Docker (via compose)
- From repo root: `make local`
- UI: http://localhost:8080

The container runs an Express server that serves the built SPA and proxies `/api/*` to the backend service containers.
