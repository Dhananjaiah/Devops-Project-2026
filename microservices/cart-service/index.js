const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const DB_NAME = 'ecommerce';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3001';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URL)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Validation middleware
const validateUserId = [
  param('userId').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid user ID'),
];

const validateProductId = [
  param('productId').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid product ID'),
];

const validateCartItem = [
  body('productId').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1, max: 1000 }).withMessage('Quantity must be between 1 and 1000'),
];

const validateQuantity = [
  body('quantity').isInt({ min: 1, max: 1000 }).withMessage('Quantity must be between 1 and 1000'),
];

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cart-service' });
});

// Get cart by user ID
app.get('/api/cart/:userId', validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const cart = await db.collection('carts').findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ userId: req.params.userId, items: [], total: 0 });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
app.post('/api/cart/:userId/items', validateUserId, validateCartItem, handleValidationErrors, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.userId;
    
    // Verify product exists
    try {
      await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, { timeout: 5000 });
    } catch (err) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const cart = await db.collection('carts').findOne({ userId });
    
    if (!cart) {
      // Create new cart
      const newCart = {
        userId,
        items: [{ productId, quantity }],
        updatedAt: new Date()
      };
      await db.collection('carts').insertOne(newCart);
      return res.status(201).json(newCart);
    }
    
    // Update existing cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }
    
    await db.collection('carts').updateOne(
      { userId },
      { $set: { items: cart.items, updatedAt: new Date() } }
    );
    
    const updatedCart = await db.collection('carts').findOne({ userId });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update cart item quantity
app.put('/api/cart/:userId/items/:productId', validateUserId, validateProductId, validateQuantity, handleValidationErrors, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { userId, productId } = req.params;
    
    const result = await db.collection('carts').updateOne(
      { userId, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    const cart = await db.collection('carts').findOne({ userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
app.delete('/api/cart/:userId/items/:productId', validateUserId, validateProductId, handleValidationErrors, async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const result = await db.collection('carts').updateOne(
      { userId },
      { $pull: { items: { productId } }, $set: { updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const cart = await db.collection('carts').findOne({ userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
app.delete('/api/cart/:userId', validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const result = await db.collection('carts').deleteOne({ userId: req.params.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Cart service listening on port ${PORT}`);
});
