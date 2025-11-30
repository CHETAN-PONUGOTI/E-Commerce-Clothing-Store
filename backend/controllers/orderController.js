import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

const addOrderItems = asyncHandler(async (req, res) => {
    const { items, totalPrice, shippingAddress } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            user: req.user._id,
            items,
            totalPrice,
            shippingAddress,
        });

        const createdOrder = await order.save();
        
        await Cart.findOneAndUpdate(
            { user: req.user._id }, 
            { $set: { items: [] } }
        );

        try {
            await sendOrderConfirmationEmail(createdOrder, req.user);
        } catch (emailError) {
            console.error(`Failed to send order email for ${createdOrder._id}:`, emailError.message);
        }

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: createdOrder._id,
        });
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        if (order.user._id.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export { addOrderItems, getOrderById };