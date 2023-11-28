const express = require('express');
const router = express.Router();

const { register,getByID,getAll ,deleteById,update,login} = require('../controllers/userController');
const isAuthenticated = require("../middlewares/auth");
router.post('/login', login)
router.post("/register", register);
router.put("/update/:ID", isAuthenticated( ['client']) ,update);
router.get("/getById/:ID", getByID);
router.get("/getAll", getAll);
router.delete("/delete/:ID", isAuthenticated(["admin"]), deleteById);
module.exports = router;