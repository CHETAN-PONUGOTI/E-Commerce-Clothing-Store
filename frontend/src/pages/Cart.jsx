// frontend/src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = () => {
    const { cartItems, totalPrice, totalItems, isLoading: isCartLoading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: '/checkout' } }); 
        }
    };


    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems} items)</h1>
            
            {cartItems.length === 0 ? (
                <p className="text-xl text-gray-600 mt-6 text-center">
                    Your cart is empty. <Link to="/products" className="text-indigo-600 hover:underline">Start shopping here.</Link>
                </p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/5">
                        {cartItems.map((item) => (
                            <CartItem key={`${item.product}-${item.size}`} item={item} />
                        ))}
                    </div>
                    
                    <div className="lg:w-2/5 h-fit sticky top-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
                            
                            <div className="flex justify-between text-lg text-gray-700 mb-2">
                                <span>Total Items:</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="flex justify-between text-2xl font-extrabold text-indigo-600 pt-4 border-t-2 mt-4">
                                <span>Cart Total:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckout} 
                                className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                            >
                                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    * Login is required to save your cart permanently and place an order.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;