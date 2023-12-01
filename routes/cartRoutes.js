const express = require('express');
const router = express.Router();

const {
    createCart,
    getCartByUserID,
    addProductToCart,
    removeProductFromCart,

} = require('../controllers/cartController');

router.post('/create', createCart);
router.get('/getByUserID/:userID', getCartByUserID);
router.post('/addProduct/:cartID', addProductToCart);
router.post('/removeProduct/:cartID', removeProductFromCart);


module.exports = router;