const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    categoryID: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    name: { type: String, required: true, unique: true },
    images: {
        type:
            [{ type: String },], validate: [{
                validator: function (v) {
                    return v.length >= 3 && v.length <= 6;
                },
            }],
        required: true,
    },
    description: { type: String, required: true },
    reference: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['available', 'sold out'],
        required: true
    },
    discountPercentage: { type: Number },
},
    { timestamps: true }
);

const product = model('product', productSchema);

module.exports = product;