# User Service

User authentication and profile management microservice for the e-commerce application.

## Technology Stack
- **Runtime**: Python 3.9+
- **Framework**: Flask
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Port**: 3002

## Features
- User registration with password hashing
- JWT-based authentication
- User login with token generation
- Profile management with token validation
- Secure password storage with bcrypt
- Token expiration handling

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### User Management

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

Response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3002
MONGO_URL=mongodb://mongodb:27017
SECRET_KEY=your-secret-key-change-in-production-minimum-32-characters
```

**Important**: Change the SECRET_KEY in production to a strong, random value.

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
export FLASK_ENV=development
flask run --port 3002
```

## Docker

### Build Image
```bash
docker build -t user-service:latest .
```

### Run Container
```bash
docker run -p 3002:3002 \
  -e MONGO_URL=mongodb://mongodb:27017 \
  -e SECRET_KEY=your-secret-key \
  user-service:latest
```

## Testing

Test the service using curl:

```bash
# Health check
curl http://localhost:3002/health

# Register a user
curl -X POST http://localhost:3002/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3002/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (replace TOKEN with actual token)
curl http://localhost:3002/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiration**: Tokens expire after 24 hours
4. **Authorization Header**: Validates Bearer token format
5. **Error Handling**: Secure error messages that don't leak sensitive information

## Production Deployment

See the main [README.md](../../README.md) for Kubernetes deployment instructions.

### Production Security Checklist
- [ ] Change SECRET_KEY to a strong random value
- [ ] Use secure MongoDB connection with authentication
- [ ] Enable HTTPS/TLS
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CORS for specific domains only
- [ ] Set up proper logging without exposing sensitive data
