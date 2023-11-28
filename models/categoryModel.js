const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    highlighted: { type: Boolean, default: false },
},
{ timestamps: true } 
);

const category = model('category', categorySchema);

module.exports = category;
