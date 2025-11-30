import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import api from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const getInitialFilters = () => {
        const params = new URLSearchParams(location.search);
        return {
            search: params.get('search') || '',
            category: params.get('category') || 'All',
            size: params.get('size') || '',
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || '',
            page: Number(params.get('page')) || 1,
            limit: 10,
        };
    };

    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState(getInitialFilters);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const buildQuery = useCallback(() => {
        const query = new URLSearchParams();
        if (filters.search) query.append('search', filters.search);
        if (filters.category && filters.category !== 'All') query.append('category', filters.category);
        if (filters.size) query.append('size', filters.size);
        if (filters.minPrice) query.append('minPrice', filters.minPrice);
        if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
        query.append('page', filters.page);
        query.append('limit', filters.limit);
        return query.toString();
    }, [filters]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const query = buildQuery();
        
        navigate({ search: query }, { replace: true });

        try {
            const { data } = await api.get(`/products?${query}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (err) {
            setError('Failed to fetch products. Have you run the seeding script?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, buildQuery, navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="flex space-x-8">
            
            <div className="w-72 flex-shrink-0">
                <Filters filters={filters} setFilters={setFilters} handleSearch={handleSearch} />
            </div>

            <div className="flex-1">
                {loading && <p className="text-lg text-center py-8">Loading products...</p>}
                {error && <p className="text-red-500 text-center py-8">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {!loading && products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
                
                <div className="flex justify-center items-center mt-8 p-4 bg-white rounded-lg shadow">
                    <button 
                        onClick={() => handlePageChange(filters.page - 1)} 
                        disabled={filters.page <= 1}
                        className="px-4 py-2 mr-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                        Page {filters.page} of {totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(filters.page + 1)} 
                        disabled={filters.page >= totalPages}
                        className="px-4 py-2 ml-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Products;