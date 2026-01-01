# Cart Service

Shopping cart management microservice for the e-commerce application.

## Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **HTTP Client**: Axios
- **Port**: 3003

## Features
- Shopping cart management per user
- Add/remove items from cart
- Update item quantities
- Product validation via Product Service
- Automatic cart clearing after order
- Inter-service communication with timeout handling

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Cart Management

#### Get User's Cart
```
GET /api/cart/:userId
```
Returns the cart for the specified user. If no cart exists, returns an empty cart.

Response:
```json
{
  "userId": "user123",
  "items": [
    {
      "productId": "prod123",
      "quantity": 2
    }
  ],
  "updatedAt": "2026-01-01T08:00:00.000Z"
}
```

#### Add Item to Cart
```
POST /api/cart/:userId/items
Content-Type: application/json

{
  "productId": "prod123",
  "quantity": 2
}
```

Validates the product exists via Product Service before adding.

#### Update Item Quantity
```
PUT /api/cart/:userId/items/:productId
Content-Type: application/json

{
  "quantity": 5
}
```

#### Remove Item from Cart
```
DELETE /api/cart/:userId/items/:productId
```

#### Clear Cart
```
DELETE /api/cart/:userId
```
Used after order creation to empty the cart.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3003
MONGO_URL=mongodb://mongodb:27017
PRODUCT_SERVICE_URL=http://product-service:3001
```

## Local Development

### Install Dependencies
```bash
npm install
```

### Run in Development Mode
```bash
npm run dev
```

### Run in Production Mode
```bash
npm start
```

## Docker

### Build Image
```bash
docker build -t cart-service:latest .
```

### Run Container
```bash
docker run -p 3003:3003 \
  -e MONGO_URL=mongodb://mongodb:27017 \
  -e PRODUCT_SERVICE_URL=http://product-service:3001 \
  cart-service:latest
```

## Testing

Test the service using curl:

```bash
# Health check
curl http://localhost:3003/health

# Get cart
curl http://localhost:3003/api/cart/user123

# Add item to cart
curl -X POST http://localhost:3003/api/cart/user123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod123",
    "quantity": 2
  }'

# Update item quantity
curl -X PUT http://localhost:3003/api/cart/user123/items/prod123 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'

# Remove item
curl -X DELETE http://localhost:3003/api/cart/user123/items/prod123

# Clear cart
curl -X DELETE http://localhost:3003/api/cart/user123
```

## Inter-Service Communication

This service communicates with:
- **Product Service**: To validate products exist before adding to cart

Communication features:
- 5-second timeout for service calls
- Graceful error handling for service unavailability
- Proper error messages returned to client

## Production Deployment

See the main [README.md](../../README.md) for Kubernetes deployment instructions.

### Production Considerations
- Service discovery via Kubernetes DNS
- Retry logic for failed service calls
- Circuit breaker pattern for resilience
- Connection pooling for MongoDB
