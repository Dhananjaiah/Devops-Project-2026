# Order Service

Order processing and management microservice for the e-commerce application.

## Technology Stack
- **Runtime**: Python 3.9+
- **Framework**: Flask
- **Database**: MongoDB
- **HTTP Client**: Requests
- **Port**: 3004

## Features
- Order creation from cart
- Order status management
- Order history tracking
- Integration with Cart and Product services
- Automatic cart clearing after order
- Order total calculation

## Order Status Flow
```
pending → processing → shipped → delivered
                    ↓
                cancelled
```

Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Order Management

#### List Orders
```
GET /api/orders
GET /api/orders?userId=user123
```
Returns all orders, optionally filtered by userId.

Response:
```json
[
  {
    "_id": "order123",
    "userId": "user123",
    "items": [
      {
        "productId": "prod123",
        "productName": "Product Name",
        "quantity": 2,
        "price": 29.99,
        "subtotal": 59.98
      }
    ],
    "total": 59.98,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "createdAt": "2026-01-01T08:00:00.000Z",
    "updatedAt": "2026-01-01T08:00:00.000Z"
  }
]
```

#### Get Order by ID
```
GET /api/orders/:orderId
```

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "userId": "user123",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

Process:
1. Fetches cart items from Cart Service
2. Retrieves product details and prices from Product Service
3. Calculates order total
4. Creates order in database
5. Clears cart via Cart Service

#### Update Order Status
```
PUT /api/orders/:orderId/status
Content-Type: application/json

{
  "status": "shipped"
}
```

Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

#### Cancel Order
```
DELETE /api/orders/:orderId
```
Sets order status to `cancelled`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3004
MONGO_URL=mongodb://mongodb:27017
CART_SERVICE_URL=http://cart-service:3003
PRODUCT_SERVICE_URL=http://product-service:3001
```

## Local Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run in Development Mode
```bash
python app.py
```

### Run with Flask Development Server
```bash
export FLASK_APP=app.py
flask run --port 3004 --debug
```

## Docker

### Build Image
```bash
docker build -t order-service:latest .
```

### Run Container
```bash
docker run -p 3004:3004 \
  -e MONGO_URL=mongodb://mongodb:27017 \
  -e CART_SERVICE_URL=http://cart-service:3003 \
  -e PRODUCT_SERVICE_URL=http://product-service:3001 \
  order-service:latest
```

## Testing

Test the service using curl:

```bash
# Health check
curl http://localhost:3004/health

# Get all orders
curl http://localhost:3004/api/orders

# Get orders for a user
curl http://localhost:3004/api/orders?userId=user123

# Create an order
curl -X POST http://localhost:3004/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'

# Update order status
curl -X PUT http://localhost:3004/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'

# Cancel order
curl -X DELETE http://localhost:3004/api/orders/ORDER_ID
```

## Inter-Service Communication

This service communicates with:
- **Cart Service**: To fetch cart items during order creation and clear cart after order
- **Product Service**: To get product details and prices

Communication features:
- 5-second timeout for service calls
- Graceful error handling for service unavailability
- Transaction-like behavior (cart cleared only after successful order)

## Business Logic

### Order Creation Flow
1. Validate userId is provided
2. Fetch cart from Cart Service
3. Validate cart is not empty
4. For each cart item:
   - Fetch product details from Product Service
   - Calculate item subtotal (price × quantity)
   - Add to order items
5. Calculate order total
6. Create order in database with status "pending"
7. Clear cart via Cart Service
8. Return order confirmation

### Error Handling
- Returns 400 if userId missing or cart empty
- Returns 500 if service communication fails
- Returns 404 if product not available
- Handles service timeouts gracefully

## Production Deployment

See the main [README.md](../../README.md) for Kubernetes deployment instructions.

### Production Considerations
- Service discovery via Kubernetes DNS
- Retry logic for failed service calls
- Circuit breaker pattern for resilience
- Connection pooling for MongoDB
- Transaction handling for order creation
- Event-driven architecture (future enhancement)
