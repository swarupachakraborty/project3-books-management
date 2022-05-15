const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const {
  isValidObjectId,
  isValidRequestBody,
  validString,
  isValid
} = require("../validations/validator");

//


const addReview = async (req, res) => {
  try {


    let data = req.body;
    if(!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Details required to add review to book" });
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
    if(!((data.rating < 6) && (data.rating > 0))) return res.status(400).send({ status: false, message: "Rating should be between 1 - 5 numbers" });

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
const updateReview = async function (req, res) {



    try {

        const bookParams = req.params.bookId
        const reviewParams = req.params.reviewId
        const requestupadtedBody = req.body


        const { review, rating, reviewedBy } = requestupadtedBody
        // validation starts


        if (!isValidObjectId(bookParams)) {
            return res.status(400).send({ status: false, msg: "Pls provide valid bookId" })
        }
        if (!isValidObjectId(reviewParams)) {
            return res.status(400).send({ status: false, msg: "invalid reviewId" })
        }

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, msg: "Rating is required" })
        }

        if (!/^[1-5]{1}$/.test(rating)) {
            return res.status(400).send({ status: false, msg: "rating must be in 1 to 5" })
        }

        if (!isValid(review)) {
            return res.status(400).send({ status: false, msg: "review is missing , pls provide review to update" })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "reviewer's name  is missing , pls provide review to update" })
        }


        const searchBook = await bookModel.findById({ _id: bookParams })
        if (!searchBook) {
            return res.status(400).send({ status: false, msg: `${bookParams} book is not present` })
        }
        const searchReview = await reviewModel.findById({ _id: reviewParams })
        if (!searchBook) {
            return res.status(400).send({ status: false, msg: `${reviewParams} review is not present` })
        }
        if (searchBook.isDeleted == false) {
            if (searchReview.isDeleted == false) {

                const updateReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })
                return res.status(200).send({ status: true, msg: "success", data: updateReviewDetails })
            }
            else {
                return res.status(400).send({ status: false, msg: "can't update because this review is not present" })
            }
        }
        else {
            return res.status(400).send({ status: false, msg: "can't update because this book is not present" })
        }


    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}



//-------------Delete-Review---------------------

const deleteReview = async function (req, res) {
  try {
      let bookParams = req.params.bookId;
      let reviewParams = req.params.reviewId

      
      if(!isValidObjectId(bookParams)) return res.status(400).send({status: false, message: "Enter a valid Book id"})
      if(!isValidObjectId(reviewParams)) return res.status(400).send({status: false, message: "Enter a valid Review id"})

      //finding book and checking whether it is deleted or not.
      let searchBook = await bookModel.findById({ _id: bookParams, isDeleted: false })
      if (!searchBook) return res.status(400).send({ status: false, message: `Book does not exist by this ${bookParams}.` })

      //finding review and checking whether it is deleted or not.
      let searchReview = await reviewModel.findById({ _id: reviewParams })
      if (!searchReview) return res.status(400).send({ status: false, message: `Review does not exist by this ${reviewParams}.` })

      //verifying the attribute isDeleted:false or not for both books and reviews documents.
      if (searchBook.isDeleted == false) {
          if (searchReview.isDeleted == false) {
              const deleteReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { isDeleted: true, deletedAt: new Date() }, { new: true })

              if (deleteReviewDetails) {
                  await bookModel.findOneAndUpdate({ _id: bookParams },{$inc:{ reviews: -1 }})
              }
              return res.status(200).send({ status: true, message: "Review deleted successfully."})

          } else {
              return res.status(400).send({ status: false, message: "Unable to delete review details Review has been already deleted" })
          }
      } else {
          return res.status(400).send({ status: false, message: "Unable to delete Book has been already deleted" })
      }
  } catch (err) {
      return res.status(500).send({ status: false, Error: err.message })
  }
}


//module.exports.updateReview=updateReview
module.exports = { addReview,deleteReview,updateReview};