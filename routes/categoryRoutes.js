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

router.post('/add',upload.single('image'),add)
router.delete('/delete/:ID', deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', upload.single('image'),update);


module.exports = router;