const express = require('express');
const router = express.Router();

const {
    createOrderFromCart,
    deleteById,
    updateById,
    getById,

} = require('../controllers/orderController');
const isAuthenticated = require("../middlewares/auth");

router.post('/create/:cartID', isAuthenticated(['client']), createOrderFromCart);
router.delete('/delete/:orderID', isAuthenticated(['admin', 'seller']), deleteById);
router.get('/getById/:orderID', getById);
router.put('/update/:orderID', isAuthenticated(['admin', 'seller']), updateById);


module.exports = router;