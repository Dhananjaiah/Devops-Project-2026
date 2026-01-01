#!/usr/bin/env bash
set -euo pipefail

KEEP_RUNNING="${KEEP_RUNNING:-0}"

wait_for_health() {
  local url="$1"
  local name="$2"
  local attempts="${3:-60}"
  local sleep_seconds="${4:-2}"

  echo "Waiting for ${name} (${url})..."
  for i in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "OK: ${name} is healthy"
      return 0
    fi
    sleep "$sleep_seconds"
  done

  echo "ERROR: ${name} did not become healthy: ${url}" >&2
  return 1
}

json_get() {
  # Usage: json_get '<json>' 'path'
  # Path examples: id, token, user.id
  python3 - <<'PY'
import json,sys
obj=json.loads(sys.argv[1])
path=sys.argv[2].split('.')
cur=obj
for p in path:
  cur=cur[p]
print(cur if isinstance(cur,str) else json.dumps(cur))
PY
}

cleanup() {
  if [[ "$KEEP_RUNNING" == "1" ]]; then
    echo "KEEP_RUNNING=1 set; leaving services running"
    return
  fi
  echo "Stopping local services..."
  make local-down || true
}
trap cleanup EXIT

echo "Starting local services..."
make local

wait_for_health "http://localhost:3001/health" "product-service"
wait_for_health "http://localhost:3002/health" "user-service"
wait_for_health "http://localhost:3003/health" "cart-service"
wait_for_health "http://localhost:3004/health" "order-service"

email="test+$(date +%s)@example.com"
password="password123"
name="Test User"

echo "Registering user: ${email}"
register_json=$(curl -fsS -X POST "http://localhost:3002/api/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${email}\",\"password\":\"${password}\",\"name\":\"${name}\"}")
user_id=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["id"])' "$register_json")

echo "Logging in..."
login_json=$(curl -fsS -X POST "http://localhost:3002/api/users/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${email}\",\"password\":\"${password}\"}")
user_token=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["token"])' "$login_json")

echo "Creating product..."
product_json=$(curl -fsS -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"High-performance laptop","price":999.99,"category":"Electronics","stock":50}')
product_id=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["id"])' "$product_json")

echo "Adding product to cart..."
curl -fsS -X POST "http://localhost:3003/api/cart/${user_id}/items" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"${product_id}\",\"quantity\":2}" >/dev/null

echo "Viewing cart..."
curl -fsS "http://localhost:3003/api/cart/${user_id}" >/dev/null

echo "Creating order..."
order_json=$(curl -fsS -X POST "http://localhost:3004/api/orders" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"${user_id}\",\"shippingAddress\":{\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\",\"country\":\"USA\"}}")
order_id=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["_id"])' "$order_json")

echo "Viewing orders..."
curl -fsS "http://localhost:3004/api/orders?userId=${user_id}" >/dev/null

echo "PASS: End-to-end journey completed"
echo "- userId: ${user_id}"
echo "- productId: ${product_id}"
echo "- orderId: ${order_id}"
