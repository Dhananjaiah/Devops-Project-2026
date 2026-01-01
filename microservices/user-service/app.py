from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
import bcrypt
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://mongodb:27017')
DB_NAME = 'ecommerce'
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'user-service'})

@app.route('/api/users/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Check if user already exists
        if db.users.find_one({'email': email}):
            return jsonify({'error': 'User already exists'}), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'created_at': datetime.utcnow()
        }
        result = db.users.insert_one(user)
        
        return jsonify({
            'id': str(result.inserted_id),
            'email': email,
            'name': name
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name')
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['GET'])
def get_profile():
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No authorization header'}), 401
        
        # Validate Bearer token format
        parts = auth_header.split(' ')
        if len(parts) != 2 or parts[0] != 'Bearer':
            return jsonify({'error': 'Invalid authorization header format'}), 401
        
        token = parts[1]
        
        # Verify token
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = db.users.find_one({'_id': ObjectId(payload['user_id'])})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'email': user['email'],
            'name': user.get('name')
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3002)))
