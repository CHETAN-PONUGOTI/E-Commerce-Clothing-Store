import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addItemToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
            } catch (err) {
                setError('Product not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setCartMessage('Please select a size.');
            return;
        }
        try {
            await addItemToCart(product, selectedSize, qty);
            setCartMessage(`${qty} x ${product.name} added to cart!`);
            setTimeout(() => setCartMessage(''), 3000); 
        } catch (err) {
            setCartMessage('Error adding to cart.');
            console.error(err);
        }
    };

    if (loading) return <h2 className="text-center text-xl py-10">Loading...</h2>;
    if (error) return <h2 className="text-red-500 text-center text-xl py-10">{error}</h2>;
    if (!product) return <h2 className="text-center text-xl py-10">Product not found</h2>;

    return (
        <div className="flex flex-col md:flex-row gap-10 p-6 bg-white rounded-xl shadow-lg">
            <div className="md:w-1/2">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-96 object-cover rounded-lg shadow-md" 
                />
            </div>
            
            <div className="md:w-1/2">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
                <p className="text-3xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                <p className="text-md text-gray-500 mb-2">Category: <strong className="text-gray-800">{product.category}</strong></p>
                <p className={`text-md font-semibold mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>

                <div className="flex items-center space-x-4 mb-4">
                    <label htmlFor="size-select" className="text-lg font-medium text-gray-700">Size:</label>
                    <select 
                        id="size-select"
                        value={selectedSize} 
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Size</option>
                        {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                
                <div className="flex items-center space-x-4 mb-8">
                    <label htmlFor="qty-input" className="text-lg font-medium text-gray-700">Quantity:</label>
                    <input 
                        id="qty-input"
                        type="number" 
                        value={qty} 
                        onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                        min="1"
                        max={product.stock}
                        className="w-20 p-2 border border-gray-300 rounded-md text-center"
                    />
                </div>

                <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0 || !selectedSize || qty === 0}
                    className="w-64 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 disabled:bg-gray-400"
                >
                    Add to Cart
                </button>
                {cartMessage && <p className={`mt-4 font-medium ${cartMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{cartMessage}</p>}
            </div>
        </div>
    );
};

export default ProductDetail;
