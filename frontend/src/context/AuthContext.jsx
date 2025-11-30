// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useCart } from './CartContext'; 

// FIX: Export the context object itself by name
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const { localCart, clearLocalCart, syncCartOnLogin } = useCart(); 

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password, guestCart: localCart });
            setUser(data);
            await syncCartOnLogin(); 
            clearLocalCart(); 
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const contextValue = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};