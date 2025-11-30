// backend/seedProducts.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

// --- Define all categories and sizes based on your filter lists ---
const ALL_CATEGORIES = ['T-shirt', 'Hoodie', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Pants', 'Skirt', 'Shirt', 'Shorts', 'Accessory'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36']; // Simplified array of all possible sizes

// --- Helper function to generate a reliable image URL ---
const getImageUrl = (category, index) => {
    // Using Picsum and Unsplash as reliable placeholders
    const imageId = (index + (category.length * 10)) % 1000; 
    return `https://picsum.photos/id/${imageId}/400/400`; // Add random query for uniqueness
};

// --- Array to hold all 220+ products ---
const sampleProducts = [];

// --- Generate 20 products for each category ---
ALL_CATEGORIES.forEach(category => {
    for (let i = 1; i <= 20; i++) {
        const product = {
            name: `${category} Style ${i}`,
            description: `High-quality ${category.toLowerCase()} with a modern fit, perfect for any season. (Product ${i} of 20)`,
            price: (Math.random() * 100 + 20 + i).toFixed(2), // Unique price
            image: getImageUrl(category, i),
            category: category,
            stock: 30 + i,
        };
        
        // Assign a subset of relevant sizes for clothing (not pants sizes for T-shirts, etc.)
        if (category === 'Jeans' || category === 'Pants') {
            product.sizes = ['28', '30', '32', '34', '36'];
        } else if (category === 'Accessory') {
            product.sizes = ['One Size'];
            product.price = (Math.random() * 50 + 5).toFixed(2);
        } else {
            product.sizes = ['XS', 'S', 'M', 'L', 'XL'];
        }
        
        sampleProducts.push(product);
    }
});


const importData = async () => {
    try {
        await Product.deleteMany(); 
        await Product.insertMany(sampleProducts);

        console.log(`✅ Data Imported! Total Products: ${sampleProducts.length}`);
        mongoose.connection.close(); 
    } catch (error) {
        console.error(`❌ Error importing data: ${error}`);
        mongoose.connection.close();
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('🗑️ Data Destroyed!');
        mongoose.connection.close();
    } catch (error) {
        console.error(`❌ Error destroying data: ${error}`);
        mongoose.connection.close();
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}