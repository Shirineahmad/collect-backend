const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  create,
  getBanners,
  update,
  setBannerhiglighted,
  getHiglightedBanners,
} = require("../controllers/bannerController");
const isAuthenticated = require("../middlewares/auth");

router.post('/create', upload.single('image'), create)
router.get('/getAll', getBanners);
router.get("/getHiglighted", getHiglightedBanners);
router.put('/update/:ID', upload.single('image'), isAuthenticated(['admin']), update);
router.put(
  "/updateHiglited/:ID",
  isAuthenticated(["admin"]),
  setBannerhiglighted
);
module.exports = router;