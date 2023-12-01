const express = require('express');
const router = express.Router();

const {
    createOrderFromCart,
    deleteById,
    updateById,
    getById,

} = require('../controllers/orderController');

router.post('/create/:cartID', createOrderFromCart);
router.delete('/delete/:orderID', deleteById);
router.get('/getById/:orderID',getById);
router.put('/update/:orderID', updateById);


module.exports = router;