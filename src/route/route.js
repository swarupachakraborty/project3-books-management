const express = require('express');
const router = express.Router();



const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
router.post("/register",userController.CreateUser)
router.post("/books",bookController.createBook)
router.post('/userLogin', userController.userLogin)


module.exports=router;