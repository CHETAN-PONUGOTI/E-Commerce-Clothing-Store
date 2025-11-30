import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
    const { isAuthenticated, user } = useAuth();
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const [shipping, setShipping] = useState({
        address: '123 Main St',
        city: 'Anytown',
        zip: '12345',
        country: 'USA'
    });

    if (!isAuthenticated) {
        return <p className="text-center text-xl py-10">Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to complete your order.</p>;
    }

    if (cartItems.length === 0) {
        return <p className="text-center text-xl py-10">Your cart is empty. <Link to="/products" className="text-indigo-600 hover:underline">Shop now</Link>.</p>;
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product, 
                    name: item.name,
                    size: item.size,
                    qty: item.qty,
                    price: item.price,
                })),
                totalPrice: totalPrice,
                shippingAddress: shipping,
            };

            const { data } = await api.post('/orders', orderData);
            
            await clearCart(); 

            navigate(`/order/${data.orderId}`);

        } catch (err) {
            setError(err.response?.data?.message || 'Order placement failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="py-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Final Checkout</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/5 p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Shipping Details</h2>
                    <div className="space-y-3 text-lg text-gray-700">
                        <p><strong>Customer:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Address:</strong> {shipping.address}, {shipping.city}, {shipping.zip}, {shipping.country}</p>
                    </div>
                    <p className="mt-6 text-sm text-blue-600">*Mock checkout: Using static address. This would typically be a dynamic form.</p>
                </div>

                <div className="lg:w-2/5 p-6 bg-gray-50 rounded-xl shadow-lg border-2 border-indigo-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
                    
                    <div className="max-h-64 overflow-y-auto mb-4 border-b pb-4">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600 py-1">
                                <span>{item.name} ({item.size}) x {item.qty}</span>
                                <span>${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-3xl font-extrabold text-gray-900 pt-4 border-t-2 border-gray-700">
                        <h3>Total:</h3>
                        <h3>${totalPrice.toFixed(2)}</h3>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={isProcessing || cartItems.length === 0} 
                        className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200 disabled:bg-gray-400"
                    >
                        {isProcessing ? 'Placing Order...' : 'Place Order Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
