const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticate = require("../middleware/authentication")
const authorise  = require("../middleware/authorisation")


router.post("/register",userController.CreateUser)

router.post('/login', userController.userLogin)

//Books api

router.post("/books/:userId",authenticate.authentication,bookController.createBook)

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId",authenticate.authentication,bookController.getBookById)

router.put("/books/:bookId",authenticate.authentication,authorise.authorisation,bookController.updateBooks)

router.delete("/books/:bookId",authenticate.authentication,bookController.deleteBooks)


module.exports=router;