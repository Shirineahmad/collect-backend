const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { create, getBanners, update } = require('../controllers/bannerController');
const isAuthenticated = require("../middlewares/auth");

router.post('/create', upload.single('image'), create)
router.get('/getAll', getBanners);
router.put('/update/:ID', upload.single('image'), isAuthenticated(['admin']), update);

module.exports = router;