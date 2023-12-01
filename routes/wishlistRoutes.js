const express = require('express');
const router = express.Router();

const {
  createWishlist,
  getByUserID,
  addProductToWishlist,
  removeProductFromWishlist,
} = require('../controllers/wishlistController');
const isAuthenticated = require("../middlewares/auth");

router.post('/create', isAuthenticated(['client']), createWishlist);
router.get('/getByUserID/:userID', getByUserID);
router.post('/addProduct/:wishlistID', isAuthenticated(['client']), addProductToWishlist);
router.post('/removeProduct/:wishlistID', isAuthenticated(['client']), removeProductFromWishlist);

module.exports = router;
