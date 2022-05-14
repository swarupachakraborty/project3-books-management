const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")

const {authentication,authorization}  = require("../middleware/authe&Auth");
const { addReview,updateReview,deleteReview } = require('../controller/reviewController');

//User APIs
router.post("/register",userController.CreateUser)
router.post('/login', userController.userLogin)

//Books APIs

router.post("/books",authentication,bookController.createBook)
router.get("/books",authentication,bookController.getBooks)
router.get("/books/:bookId",authentication,bookController.getBookById)
router.put("/books/:bookId",authentication,authorization,bookController.updateBook)
router.delete("/books/:bookId",authentication,authorization,bookController.deleteBooks)

//Review APIs

router.post("/books/:bookId/review",addReview)
  router.put("books/:bookId/review/:reviewId", updateReview)
 router.delete('/books/:bookId/review/:reviewId', deleteReview);
module.exports=router;