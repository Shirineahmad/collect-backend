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
    addImageToArray,
    // getWithPagination,
    removeImageFromArray,
    getAllByCategoryID,
    getAllByCategoryName,
    updateDiscountByCategoryID,
} = require('../controllers/productController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add', upload.array('images', 6), isAuthenticated(['admin', 'seller']), add);
router.delete('/delete/:ID', isAuthenticated(['admin', 'seller']), deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
// router.get("/paginate?", getWithPagination);
router.put('/update/:ID', upload.array('images', 6), isAuthenticated(['admin', 'seller']), update);
router.post('/addImage', upload.single('image'), isAuthenticated(['admin', 'seller']), addImageToArray);
router.post('/removeImage', isAuthenticated(['admin', 'seller']), removeImageFromArray);
router.get('/category/:categoryID', getAllByCategoryID);
router.get('/categoryByName/:categoryName', getAllByCategoryName);
router.post('/updateDiscountByCategoryID/:categoryID',isAuthenticated(['admin', 'seller']), updateDiscountByCategoryID);

module.exports = router;