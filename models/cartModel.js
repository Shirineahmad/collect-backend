const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    productIds: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true, unique: true }
    ],
    totalPrice: { type: Number, required: true },
},
 { timestamps: true } 
);

const cart = model('cart', cartSchema);

module.exports = cart;
