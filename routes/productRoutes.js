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
    removeImageFromArray,
    getAllByCategoryID,
    getAllByCategoryName,
} = require('../controllers/productController');

router.post('/add', upload.array('images', 6), add);
router.delete('/delete/:ID', deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', upload.array('images', 6), update);
router.post('/addImage', upload.single('image'), addImageToArray);
router.post('/removeImage', removeImageFromArray);
router.get('/category/:categoryID', getAllByCategoryID);
router.get('/categoryByName/:categoryName', getAllByCategoryName);

module.exports = router;