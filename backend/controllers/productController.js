import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

const getProducts = asyncHandler(async (req, res) => {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    if (category && category !== 'All') {
        query.category = category;
    }

    if (size) {
        query.sizes = { $in: [size] };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const pageSize = Number(limit);
    const pageNum = Number(page);

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1));

    res.json({
        products,
        page: pageNum,
        pages: Math.ceil(count / pageSize),
        totalProducts: count,
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById };