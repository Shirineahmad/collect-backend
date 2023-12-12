const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const createCart = async (req, res) => {
    try {
        const { userID } = req.body;
        console.log('Received request body:', req.body);

        const userExists = await User.findById(userID);

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: `User with id ${userID} isn't registered`,
            });
        }

        const newCart = new Cart({
            userId: userID,
            productIds: [],
            totalPrice: 0, 
        });

        await newCart.save();

        res.status(200).json({
            success: true,
            message: 'Cart created successfully',
            data: newCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to create cart',
            error: error.message,
        });
    }
};

const getCartByUserID = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No cart for the user with id ${req.params.userID}`,
      });
    }

    const cart = await Cart.findOne({ userId: req.params.userID }).populate(
      "productIds"
    );

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: {
        user: user,
        cart: cart,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get cart by user ID",
      error: error.message,
    });
  }
};

const addProductToCart = async (req, res) => {
    try {
        const { productID } = req.body;

        const productExists = await Product.findById(productID);

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: `No product with id ${productID} available`,
            });
        }

        if (productExists.status === 'sold') {
            return res.status(401).json({
                success: false,
                message: `Product ${productExists.name} is already sold`,
            });
        }

        const cart = await Cart.findOne({ _id: req.params.cartID });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart with id ${req.params.cartID} available`,
            });
        }

        if (cart.productIds.includes(productID)) {
            return res.status(401).json({
                success: false,
                message: `${productExists.name} already exists in your cart`,
            });
        }

        const productPrice = productExists.discountPercentage
            ? productExists.price - (productExists.price * productExists.discountPercentage) / 100
            : productExists.price;

        cart.productIds.push(productID);
        cart.totalPrice += productPrice;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to add product to cart',
            error: error.message,
        });
    }
};


const removeProductFromCart = async (req, res) => {
    try {
        const { productID } = req.body;

        const cart = await Cart.findOne({ _id: req.params.cartID });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `No cart with id ${req.params.cartID} available`,
            });
        }

        const productExists = await Product.findById(productID);

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: `No product with id ${productID} available`,
            });
        }

        if (!cart.productIds.includes(productID)) {
            return res.status(401).json({
              success: false,
              message: `Product with id ${productID} not found in your cart`,
            });
          }

        const productPrice = productExists.discountPercentage
            ? productExists.price - (productExists.price * productExists.discountPercentage) / 100
            : productExists.price;

        const index = cart.productIds.indexOf(productID);
        if (index !== -1) {
            cart.productIds.splice(index, 1);
            cart.totalPrice -= productPrice;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to remove product from cart',
            error: error.message,
        });
    }
};

module.exports = {
    createCart,
    getCartByUserID,
    addProductToCart,
    removeProductFromCart,
};