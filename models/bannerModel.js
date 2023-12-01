const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bannerSchema = new Schema({
    text: { type: String, required: true },
    textButton: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length <= 25;
            },
            message: 'The button text must be a maximum of 25 characters'
        }
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                return urlRegex.test(value);
            },
            message: 'Provide a valid URL in the link input'
        }
    },
    image: { type: String, required: true },
    higlighted: { type: Boolean, default: false },
},
    { timestamps: true }
);

const banner = model('banner', bannerSchema);

module.exports = banner;
