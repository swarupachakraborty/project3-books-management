const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticate = require("../middleware/authentication")
const authorise  = require("../middleware/authorisation");
const { getReview,updateReview } = require('../controller/reviewController');


router.post("/register",userController.CreateUser)

router.post('/login', userController.userLogin)

router.post("/books/:userId",bookController.createBook)

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId",bookController.getBookById)

router.delete("/books/:bookId",bookController.deleteBooks)

//==========review api

router.post("/books/:bookId/review",getReview)

router.put("books/:bookId/review/:reviewId", updateReview)

// router.delete('/books/:bookId/review/:reviewId', deleteReview);
module.exports=router;