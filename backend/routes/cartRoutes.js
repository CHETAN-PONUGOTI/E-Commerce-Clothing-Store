import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserCart, addItemToCart, removeItemFromCart, clearUserCart } from '../controllers/cartController.js';

const router = express.Router();

router.route('/').get(protect, getUserCart);
router.route('/add').post(protect, addItemToCart);
router.route('/remove/:productId/:size').delete(protect, removeItemFromCart);
router.route('/clear').delete(protect, clearUserCart);

export default router;