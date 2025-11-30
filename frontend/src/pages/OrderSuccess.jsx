import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                setError('Failed to load order details. It may be invalid or you are not authorized.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        } else {
            setError('No Order ID provided.');
            setLoading(false);
        }
    }, [id]);

    if (loading) return <h2 className="text-center text-xl py-10">Loading Order Details...</h2>;
    if (error) return <h2 className="text-red-500 text-center text-xl py-10">{error}</h2>;
    if (!order) return <h2 className="text-center text-xl py-10">Order not found.</h2>;

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl text-center">
            <h1 className="text-4xl font-extrabold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
            <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. A confirmation email has been sent to <strong className="text-indigo-600">{order.user.email}</strong>.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left border border-green-200">
                <p className="text-xl font-bold mb-3 border-b pb-2 text-gray-800">Order Details</p>
                <div className="space-y-1 text-gray-700">
                    <p><strong>Order ID:</strong> <span className="font-mono text-indigo-700">{order._id}</span></p>
                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span className="text-yellow-600 font-semibold">{order.status}</span></p>
                    <p><strong>Shipping To:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-left mb-3 pt-4 border-t">Items Summary</h2>
            <ul className="space-y-2 mb-6 text-left">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-md text-gray-700 border-b border-gray-100 pb-1">
                        <span>{item.name} ({item.size}) x {item.qty}</span>
                        <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <h2 className="text-3xl font-extrabold text-gray-900 mt-6 border-t pt-4">Total Paid: ${order.totalPrice.toFixed(2)}</h2>

            <Link 
                to="/products" 
                className="inline-block mt-8 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xl transition duration-300"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderSuccess;
