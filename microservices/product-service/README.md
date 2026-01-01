# Product Service

Product management microservice for the e-commerce application.

## Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Port**: 3001

## Features
- Complete CRUD operations for products
- MongoDB integration with connection pooling
- RESTful API design
- Health check endpoint
- Error handling

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Products

#### Get All Products
```
GET /api/products
```
Returns all products in the catalog.

#### Get Product by ID
```
GET /api/products/:id
```
Returns a specific product by ID.

#### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Category",
  "stock": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 150
}
```

#### Delete Product
```
DELETE /api/products/:id
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3001
MONGO_URL=mongodb://mongodb:27017
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
docker build -t product-service:latest .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e MONGO_URL=mongodb://mongodb:27017 \
  product-service:latest
```

## Testing

Test the service using curl:

```bash
# Health check
curl http://localhost:3001/health

# Get all products
curl http://localhost:3001/api/products

# Create a product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "description": "A sample product",
    "price": 29.99,
    "category": "Electronics",
    "stock": 50
  }'
```

## Production Deployment

See the main [README.md](../../README.md) for Kubernetes deployment instructions.
