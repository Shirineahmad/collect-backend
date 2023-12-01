const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    add,
    getAll,
    getByID,
    update,
    deleteById,

} = require('../controllers/categoryController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add', upload.single('image'), isAuthenticated(['admin', 'seller']), add)
router.delete('/delete/:ID', isAuthenticated(['admin', 'seller']), deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', upload.single('image'), isAuthenticated(['admin', 'seller']), update);


module.exports = router;