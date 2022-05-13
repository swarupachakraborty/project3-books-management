const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const {
  isValidObjectId,
  isValidRequestBody,
  validString,
} = require("../validations/validator");

//


const addReview = async (req, res) => {
  try {


    let data = req.body;
    if(isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Details required to add review to book" });
    let bookId = req.params.bookId;

    if(!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Enter a valid book id" });

    let checkBookId = await bookModel.findById(bookId);
    if(!checkBookId) return res.status(404).send({ status: false, message: "Book not found" });


  if(checkBookId.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found or might have been deleted" })

   
    if(!data.rating) return res.status(400).send({ status: false, message: "Rating is required and should not be 0" });

    if(data.hasOwnProperty('reviewedBy')){
      if(validString(data.reviewedBy)) return res.status(400).send({ status: false, message: "Name should not contain numbers" });
    }
    
    if (validString(data.reviewedBy) || validString(data.review)) {
      return res.status(400).send({ status: false, message: "Enter valid data in review and reviewedBy" })
    }

    if(!validString(data.rating)) return res.status(400).send({ status: false, message: "Rating should be in numbers" });
    if(!((data.rating < 6 ) && (data.rating > 0))) return res.status(400).send({ status: false, message: "Rating should be between 1 - 5 numbers" });

    data.bookId = bookId;

    let reviewData = await reviewModel.create(data) ;
    await bookModel.findByIdAndUpdate(
      {_id: bookId},
      {$inc: {reviews: 1}}
    )

    res.status(200).send({ status: true, message: "Success", data: reviewData })
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}



//---------------PUT /books/:bookId/review/:reviewId





//-------------DELETE_________________-
const deleteReview = async function (req, res) {
  try {
      let bookId = req.params.bookId
      let reviewId = req.params.reviewId

      if (!isValidObjectId(bookId)) {
          return res.status(400).send({ status: false, msg: "pls enter valid bookId in path param" })
      }

      if (!isValidObjectId(reviewId)) {
          return res.status(400).send({ status: false, msg: "enter the valid reviewId in path parameter " })
      }
      let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (book) {

          let isReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
          if (isReview) {
              let deleteInReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true })
              let updateInBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
              res.status(200).send("completed the task")
          } else {
              res.status(404).send({ msg: "No Review data are found" })

          }
      } else {
          res.status(404).send({ msg: "No Book found" })
      }
  } catch (err) {
      console.log(err)
      res.status(500).send({ msg: err.message })
  }
}
module.exports = { addReview,deleteReview };
