const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel')
const nodemailer = require('nodemailer');

const createOrderFromCart = async (req, res) => {
    try {
        const { cartID } = req.params;
        const { shippingMethod } = req.body;

        const cart = await Cart.findById(cartID).populate('productIds');

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart found with id ${cartID}`,
            });
        }

        for (const productId of cart.productIds) {
            await Product.findByIdAndUpdate(productId, { status: 'sold' });
        }

        const defaultShippingMethod = 'delivery';
        const selectedShippingMethod = shippingMethod || defaultShippingMethod;

        const order = new Order({
            userId: cart.userId, 
            productIds: cart.productIds,
            totalPrice: cart.totalPrice + (selectedShippingMethod === 'delivery' ? 3 : 0),
            status: 'pending',
            shippingMethod: selectedShippingMethod,
            shippingFee: selectedShippingMethod === 'delivery' ? 3 : 0,
            paymentMethod: 'cash on delivery',
        });

        await order.save();

        cart.productIds = [];
        cart.totalPrice = 0;
        await cart.save();

        await sendOrderConfirmationEmailToClient(order);
        await sendOrderNotificationEmailToOwner(order);

        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to create order from cart',
            error: error.message,
        });
    }
};

const sendOrderConfirmationEmailToClient = async (order) => {
    try {
        const transporter = nodemailer.createTransport({
        
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

     
        const user = await User.findById(order.userId);

        const productDetails = order.productIds.map(product => `
            <div>
                <p>Product ID: ${product._id}</p>
                <p>Name: ${product.name}</p>
                <img src="${product.images[0]}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Reference: ${product.reference}</p>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Order Confirmation',
            html: `
                <p>Thank you for your order!</p>
                <p>Order ID: ${order._id}</p>
                <p>User Details:</p>
                <p>Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address}</p>
                <p>Phone Number: ${user.phoneNumber}</p>
                <p>Product Details:</p>
                ${productDetails}
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Method: ${order.shippingMethod}</p>
                <p>Shipping Fee: ${order.shippingFee}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to client:', error);
    }
};

const sendOrderNotificationEmailToOwner = async (order) => {
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const user = await User.findById(order.userId);

        const productDetails = order.productIds.map(product => `
            <div>
                <p>Product ID: ${product._id}</p>
                <p>Name: ${product.name}</p>
                <img src="${product.images[0]}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Reference: ${product.reference}</p>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN, 
            subject: 'New Order Notification',
            html: `
                <p>You have received a new order!</p>
                <p>Order ID: ${order._id}</p>
                <p>User Details:</p>
                <p>Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address}</p>
                <p>Phone Number: ${user.phoneNumber}</p>
                <p>Product Details:</p>
                ${productDetails}
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Method: ${order.shippingMethod}</p>
                <p>Shipping Fee: ${order.shippingFee}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to website owner:', error);
    }
};

const deleteById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderID);

        if (deletedOrder) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} deleted successfully`,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to delete order',
            error: error.message,
        });
    }
};

const updateById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { status, shippingMethod, shippingFee, paymentMethod } = req.body;

        const updatedFields = {};

        if (status) updatedFields.status = status;
        if (shippingMethod) updatedFields.shippingMethod = shippingMethod;
        if (shippingFee) updatedFields.shippingFee = shippingFee;
        if (paymentMethod) updatedFields.paymentMethod = paymentMethod;

        const updatedOrder = await Order.findByIdAndUpdate(orderID, updatedFields, { new: true });

        if (updatedOrder) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} updated successfully`,
                data: updatedOrder,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update order',
            error: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const { orderID } = req.params;
        const order = await Order.findById(orderID);

        if (order) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${orderID} retrieved successfully`,
                data: order,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order with ID ${orderID} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to get order',
            error: error.message,
        });
    }
};

module.exports = {
    createOrderFromCart,
    deleteById,
    updateById,
    getById,
}