import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Cart from '../models/Cart.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password, guestCart } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        if (guestCart && guestCart.length > 0) {
            let userCart = await Cart.findOne({ user: user._id });

            if (!userCart) {
                userCart = await Cart.create({ user: user._id, items: guestCart });
            } else {
                guestCart.forEach(guestItem => {
                    const existingItemIndex = userCart.items.findIndex(
                        item => item.product.toString() === guestItem.product && item.size === guestItem.size
                    );

                    if (existingItemIndex > -1) {
                        userCart.items[existingItemIndex].qty += guestItem.qty;
                    } else {
                        userCart.items.push(guestItem);
                    }
                });
                await userCart.save();
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'Login successful, cart potentially merged'
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, authUser, logoutUser };