const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticate = require("../middleware/authentication")
const authorise  = require("../middleware/authorisation")


router.post("/register",userController.CreateUser)

router.post('/login', userController.userLogin)

router.post("/books/:userId",authenticate.authentication,bookController.createBook)

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId",bookController.getBookById)

router.delete("/books/:bookId",bookController.deleteBooks)


module.exports=router;