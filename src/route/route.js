const express = require('express');
const router = express.Router();



const userController = require("../controller/userController")
router.post("/register",userController.CreateUser)

router.post('/userLogin', userController.userLogin)


module.exports=router;