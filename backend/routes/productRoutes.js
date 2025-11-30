// backend/routes/productRoutes.js
import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
// Note: We don't need the 'protect' middleware here as these routes are public

const router = express.Router();

// @desc    Fetch all products with search, filters, and pagination
// @route   GET /api/products
// @access  Public
router.route('/').get(getProducts);

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.route('/:id').get(getProductById);

export default router;