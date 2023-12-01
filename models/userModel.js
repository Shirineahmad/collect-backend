const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema({
  fullName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true, unique: true },
  city: { type: String },
  fullAddress: {
    street: { type: String },
    building: { type: String },
    floor: { type: String },
    description: { type: String },
  },
  role: {
    type: String,
    enum: ["admin", "seller", "client"], required: true, default: 'client'
  },

},
  { timestamps: true });

const UserModel = model('users', userSchema);

module.exports = UserModel;