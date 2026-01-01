from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://mongodb:27017')
DB_NAME = 'ecommerce'
CART_SERVICE_URL = os.getenv('CART_SERVICE_URL', 'http://cart-service:3003')
PRODUCT_SERVICE_URL = os.getenv('PRODUCT_SERVICE_URL', 'http://product-service:3001')

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'order-service'})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        user_id = request.args.get('userId')
        query = {'userId': user_id} if user_id else {}
        orders = list(db.orders.find(query))
        
        # Convert ObjectId to string
        for order in orders:
            order['_id'] = str(order['_id'])
        
        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = db.orders.find_one({'_id': order_id})
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        order['_id'] = str(order['_id'])
        return jsonify(order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        # Get cart from cart service
        cart_response = requests.get(f'{CART_SERVICE_URL}/api/cart/{user_id}')
        if cart_response.status_code != 200:
            return jsonify({'error': 'Failed to get cart'}), 500
        
        cart = cart_response.json()
        
        if not cart.get('items') or len(cart['items']) == 0:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Get product details and calculate total
        items_with_details = []
        total = 0
        
        for item in cart['items']:
            product_response = requests.get(
                f'{PRODUCT_SERVICE_URL}/api/products/{item["productId"]}'
            )
            if product_response.status_code == 200:
                product = product_response.json()
                item_total = product.get('price', 0) * item['quantity']
                items_with_details.append({
                    'productId': item['productId'],
                    'productName': product.get('name', 'Unknown'),
                    'quantity': item['quantity'],
                    'price': product.get('price', 0),
                    'subtotal': item_total
                })
                total += item_total
        
        # Create order
        order = {
            'userId': user_id,
            'items': items_with_details,
            'total': total,
            'status': 'pending',
            'shippingAddress': data.get('shippingAddress', {}),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = db.orders.insert_one(order)
        order['_id'] = str(result.inserted_id)
        
        # Clear cart after order
        try:
            requests.delete(f'{CART_SERVICE_URL}/api/cart/{user_id}')
        except:
            pass  # Don't fail order if cart clear fails
        
        return jsonify(order), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        data = request.json
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status required'}), 400
        
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        result = db.orders.update_one(
            {'_id': order_id},
            {'$set': {'status': new_status, 'updatedAt': datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Order not found'}), 404
        
        order = db.orders.find_one({'_id': order_id})
        order['_id'] = str(order['_id'])
        return jsonify(order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['DELETE'])
def cancel_order(order_id):
    try:
        result = db.orders.update_one(
            {'_id': order_id},
            {'$set': {'status': 'cancelled', 'updatedAt': datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'message': 'Order cancelled successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3004)))
