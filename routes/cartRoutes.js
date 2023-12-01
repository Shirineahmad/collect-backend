const express = require('express');
const router = express.Router();

const {
    createCart,
    getCartByUserID,
    addProductToCart,
    removeProductFromCart,

} = require('../controllers/cartController');
const isAuthenticated = require("../middlewares/auth");

router.post('/create', isAuthenticated(['client']), createCart);
router.get('/getByUserID/:userID', getCartByUserID);
router.post('/addProduct/:cartID', isAuthenticated(['client']), addProductToCart);
router.post('/removeProduct/:cartID', isAuthenticated(['client']), removeProductFromCart);

module.exports = router;