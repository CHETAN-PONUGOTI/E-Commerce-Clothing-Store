// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="container flex items-center justify-between h-16">
                <Link to="/" className="text-white text-xl font-bold tracking-wider ui-monospace">
                     DressUp
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/products" className="text-gray-300 hover:text-white transition duration-200">Products</Link>
                    <Link to="/cart" className="text-gray-300 hover:text-white transition duration-200 relative">
                        Cart ({totalItems})
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-300">Hello, {user?.name.split(' ')[0]}</span>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition duration-200">Login</Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm transition duration-200">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;