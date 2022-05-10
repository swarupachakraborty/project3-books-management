const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")



router.post("/register",userController.CreateUser)

router.post('/login', userController.userLogin)

router.post("/books",bookController.createBook)

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId",bookController.getBookById)


module.exports=router;