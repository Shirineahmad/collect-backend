const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    productIds: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'delivered', 'canceled'], required: true },
    shippingMethod: { type: String, enum: ['pick up', 'delivery'], default: 'delivery', required: true },
    shippingFee: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash on delivery', 'credit card'], default: 'cash on delivery',required: true },
},
{ timestamps: true } 
);

const order = model('order', orderSchema);

module.exports = order;
