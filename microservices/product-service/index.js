const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const DB_NAME = 'ecommerce';

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
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 1, max: 200 }).withMessage('Name must be 1-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be max 1000 characters'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Category must be 1-100 characters'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('imageUrl').optional().trim().isURL().withMessage('Image URL must be valid'),
];

const validateProductId = [
  param('id').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid product ID'),
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
  res.json({ status: 'healthy', service: 'product-service' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const products = await db.collection('products')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection('products').countDocuments();
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
app.get('/api/products/:id', validateProductId, handleValidationErrors, async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/products', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const product = req.body;
    const result = await db.collection('products').insertOne(product);
    res.status(201).json({ id: result.insertedId, ...product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
app.put('/api/products/:id', validateProductId, validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const result = await db.collection('products').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', validateProductId, handleValidationErrors, async (req, res) => {
  try {
    const result = await db.collection('products').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Product service listening on port ${PORT}`);
});
