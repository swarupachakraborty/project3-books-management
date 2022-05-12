const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const authenticate = require("../middleware/authentication")
const authorise  = require("../middleware/authorisation");
const { getReview,updateReview } = require('../controller/reviewController');


router.post("/register",userController.CreateUser)

router.post('/login', userController.userLogin)

<<<<<<< HEAD
router.post("/books/:userId",bookController.createBook)
=======
//Books api

router.post("/books/:userId",authenticate.authentication,bookController.createBook)
>>>>>>> d0d6f3739d3dced2127afe4949d45ddccc42a51a

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId",authenticate.authentication,bookController.getBookById)

router.put("/books/:bookId",authenticate.authentication,authorise.authorisation,bookController.updateBooks)

router.delete("/books/:bookId",authenticate.authentication,bookController.deleteBooks)

//==========review api

router.post("/books/:bookId/review",getReview)

router.put("books/:bookId/review/:reviewId", updateReview)

// router.delete('/books/:bookId/review/:reviewId', deleteReview);
module.exports=router;