// frontend/src/components/Filters.jsx
import React from 'react';

const categories = ['All', 'T-shirt', 'Hoodie', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Pants', 'Skirt', 'Shirt', 'Shorts', 'Accessory'];
const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];

const Filters = ({ filters, setFilters, handleSearch }) => {

    const handleChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Filter Products</h3>
            
            {/* Search Input */}
            <div className="mb-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Search name or description..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                    onClick={handleSearch} 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md transition duration-200"
                >
                    Search
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                <select name="category" value={filters.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Size Filter */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                <select name="size" value={filters.size} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                    {sizes.map(s => <option key={s} value={s === 'All' ? '' : s}>{s}</option>)}
                </select>
            </div>

            {/* Price Filters */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range ($):</label>
                <div className="flex space-x-4">
                    <input 
                        type="number" 
                        name="minPrice" 
                        placeholder="Min Price" 
                        value={filters.minPrice} 
                        onChange={handleChange} 
                        className="w-1/2 p-2 border border-gray-300 rounded-md" 
                    />
                    <input 
                        type="number" 
                        name="maxPrice" 
                        placeholder="Max Price" 
                        value={filters.maxPrice} 
                        onChange={handleChange} 
                        className="w-1/2 p-2 border border-gray-300 rounded-md" 
                    />
                </div>
            </div>
            
            <button 
                onClick={handleSearch} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 mt-4"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default Filters;