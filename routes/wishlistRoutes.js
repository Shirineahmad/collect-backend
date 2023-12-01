const express = require('express');
const router = express.Router();

const {
  createWishlist,
  getByUserID,
  addProductToWishlist,
  removeProductFromWishlist,
} = require('../controllers/wishlistController');

router.post('/create', createWishlist);
router.get('/getByUserID/:userID', getByUserID);
router.post('/addProduct/:wishlistID', addProductToWishlist);
router.post('/removeProduct/:wishlistID', removeProductFromWishlist);

module.exports = router;
