const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

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