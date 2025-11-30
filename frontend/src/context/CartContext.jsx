// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = 'guestCart';

export const CartProvider = ({ children }) => {
    // FIX 1: Safely access AuthContext directly (avoids circular dependency errors)
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext ? authContext.isAuthenticated : false;
    const user = authContext ? authContext.user : null;
    
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const clearLocalCart = () => {
        localStorage.removeItem(LOCAL_CART_KEY);
    }
    
    const fetchUserCart = useCallback(async () => {
        if (isAuthenticated && user) {
            try {
                const { data } = await api.get('/cart');
                setCartItems(data.items || []);
            } catch (error) {
                console.error('Failed to fetch user cart:', error);
                setCartItems([]);
            }
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (!authContext) {
            setIsLoading(true);
            return; 
        }

        if (isAuthenticated) {
            fetchUserCart(); 
        } else {
            // --- THIS IS THE GUEST PATH ---
            const storedCart = localStorage.getItem(LOCAL_CART_KEY);
            setCartItems(storedCart ? JSON.parse(storedCart) : []);
        }
        setIsLoading(false); // <--- THIS LINE IS EXECUTED *AFTER* THE GUEST LOAD
    }, [isAuthenticated, fetchUserCart, authContext]);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated, isLoading]);

    const syncCartOnLogin = async () => {
        if (isAuthenticated) {
            await fetchUserCart();
        }
    };

    const addItemToCart = async (product, size, qty) => {
        const item = { 
            product: product._id, 
            name: product.name, 
            price: product.price, 
            image: product.image,
            size, 
            qty: Number(qty) 
        };

        if (isAuthenticated) {
            try {
                const { data } = await api.post('/cart/add', item);
                setCartItems(data.items);
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to add item to cart (Auth)');
            }
        } else {
            setCartItems(prevItems => {
                const existingIndex = prevItems.findIndex(i => i.product === product._id && i.size === size);
                if (existingIndex > -1) {
                    const newItems = [...prevItems];
                    newItems[existingIndex].qty += Number(qty);
                    return newItems;
                } else {
                    return [...prevItems, item];
                }
            });
        }
    };

    const removeItemFromCart = async (productId, size) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.delete(`/cart/remove/${productId}/${size}`);
                setCartItems(data.items);
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to remove item (Auth)');
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => !(item.product === productId && item.size === size)));
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await api.delete('/cart/clear');
                setCartItems([]);
            } catch (error) {
                console.error('Failed to clear user cart on backend:', error);
            }
        } else {
            setCartItems([]);
            clearLocalCart();
        }
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            totalItems,
            totalPrice,
            addItemToCart,
            removeItemFromCart,
            clearCart,
            localCart: cartItems, 
            clearLocalCart, 
            syncCartOnLogin, 
            fetchUserCart, 
            isLoading,
        }}>
            {children}
        </CartContext.Provider>
    );
};