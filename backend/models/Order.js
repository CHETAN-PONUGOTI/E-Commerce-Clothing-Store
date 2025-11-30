import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;