const Wishlist = require('../models/wishlistModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const createWishlist = async (req, res) => {
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
  
      const newWishlist = new Wishlist({
        userId: userID,
        productIds: [],
      });
  
      await newWishlist.save();
  
      res.status(200).json({
        success: true,
        message: 'Wishlist created successfully',
        data: newWishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Unable to create wishlist',
        error: error.message,
      });
    }
  };

const getByUserID = async (req, res) => {
  try {
    const userExists = await User.findById(req.params.userID);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: `No wishlist for the user with id ${req.params.userID}`,
      });
    }

    const wishlist = await Wishlist.findOne({ userId: req.params.userID }).populate('productIds');

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to get wishlist by user ID',
      error: error.message,
    });
  }
};

const addProductToWishlist = async (req, res) => {
  try {
    const { productID } = req.body;

    const productExists = await Product.findById(productID);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: `No product with id ${productID} available`,
      });
    }

    const wishlist = await Wishlist.findOne({ _id: req.params.wishlistID });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: `No wishlist with id ${req.params.wishlistID} available`,
      });
    }

    wishlist.productIds.push(productID);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to add product to wishlist',
      error: error.message,
    });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const { productID } = req.body;

    const wishlist = await Wishlist.findOne({ _id: req.params.wishlistID });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: `No wishlist with id ${req.params.wishlistID} available`,
      });
    }

    const index = wishlist.productIds.indexOf(productID);
    if (index !== -1) {
      wishlist.productIds.splice(index, 1);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to remove product from wishlist',
      error: error.message,
    });
  }
};

module.exports = {
  createWishlist,
  getByUserID,
  addProductToWishlist,
  removeProductFromWishlist,
};
