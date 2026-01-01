from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient
from bson import ObjectId
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

# Rate limiting configuration
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")
DB_NAME = "ecommerce"
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
db = client[DB_NAME]


# Input validation decorator
def validate_json(*expected_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({"error": "Content-Type must be application/json"}), 400
            data = request.json
            for field in expected_fields:
                if field not in data or not data[field]:
                    return jsonify({"error": f"{field} is required"}), 400
            return f(*args, **kwargs)

        return decorated_function

    return decorator


# Input sanitization with validation
def sanitize_string(value, max_length=200):
    if not isinstance(value, str):
        raise ValueError(f"Expected string, got {type(value).__name__}")
    return value.strip()[:max_length]


@app.route("/health", methods=["GET"])
@limiter.exempt
def health():
    return jsonify({"status": "healthy", "service": "user-service"})


@app.route("/ready", methods=["GET"])
@limiter.exempt
def ready():
    try:
        client.admin.command("ping")
        return jsonify({"status": "ready", "service": "user-service"})
    except Exception:
        return jsonify({"status": "not-ready", "service": "user-service"}), 503


@app.route("/api/users/register", methods=["POST"])
@limiter.limit("5 per hour")
@validate_json("email", "password")
def register():
    try:
        data = request.json
        email = sanitize_string(data.get("email"), 100)
        password = data.get("password")
        name = sanitize_string(data.get("name", ""), 100)

        # Validate email format
        if "@" not in email or len(email) < 3:
            return jsonify({"error": "Invalid email format"}), 400

        # Validate password strength
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        # Check if user already exists
        if db.users.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 409

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        # Create user
        user = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "created_at": datetime.utcnow(),
        }
        result = db.users.insert_one(user)

        return (
            jsonify({"id": str(result.inserted_id), "email": email, "name": name}),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/login", methods=["POST"])
@limiter.limit("10 per hour")
@validate_json("email", "password")
def login():
    try:
        data = request.json
        email = sanitize_string(data.get("email"), 100)
        password = data.get("password")

        # Find user
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Check password
        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        token = jwt.encode(
            {
                "user_id": str(user["_id"]),
                "email": user["email"],
                "exp": datetime.utcnow() + timedelta(hours=24),
            },
            SECRET_KEY,
            algorithm="HS256",
        )

        return jsonify(
            {
                "token": token,
                "user": {
                    "id": str(user["_id"]),
                    "email": user["email"],
                    "name": user.get("name"),
                },
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/profile", methods=["GET"])
@limiter.limit("30 per hour")
def get_profile():
    try:
        # Get token from header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "No authorization header"}), 401

        # Validate Bearer token format
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"error": "Invalid authorization header format"}), 401

        token = parts[1]

        # Verify token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = db.users.find_one({"_id": ObjectId(payload["user_id"])})

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(
            {"id": str(user["_id"]), "email": user["email"], "name": user.get("name")}
        )
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 3002)))
