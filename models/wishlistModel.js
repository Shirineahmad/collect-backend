const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const wishlistSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    productIds: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true, unique: true }
    ],
});

const wishlist = model('wishlist', wishlistSchema);

module.exports = wishlist;