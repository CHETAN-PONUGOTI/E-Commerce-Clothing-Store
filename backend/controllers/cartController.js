import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

const getUserCart = asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { product: productId, size, qty } = req.body;
    
    const productExists = await Product.findById(productId);
    if (!productExists) {
        res.status(404);
        throw new Error('Product not found');
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItemIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId && i.size === size
    );

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].qty += Number(qty);
    } else {
        cart.items.push({
            product: productId,
            name: productExists.name,
            price: productExists.price,
            image: productExists.image,
            size,
            qty: Number(qty),
        });
    }

    await cart.save();
    res.status(200).json(cart);
});

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId, size } = req.params;

    const cart = await getOrCreateCart(req.user._id);
    
    cart.items = cart.items.filter(
        (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    res.status(200).json(cart);
});

const clearUserCart = asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', items: [] });
});


export { getUserCart, addItemToCart, removeItemFromCart, clearUserCart };