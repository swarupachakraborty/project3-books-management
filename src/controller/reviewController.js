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
const updateReview = async function (req, res){
  try {

      const reqBody = req.body
      
      if(!isValidRequestBody(reqBody)) {
          return res.status(400).send({status: false,msg: "Invalid request, Please provide details"});
      }

      const bookId = req.params.bookId;
      const reviewId = req.params.reviewId

      if (!isValidObjectId(bookId)) {
          return res.status(400).send({ status: false, msg: "Please Enter Valid Book ID" });
      }

      if (!isValidObjectId(reviewId)) {
          return res.status(400).send({ status: false, msg: "Please Enter Valid Review ID" });
      }

      const bookData = await bookModel.findOne({ _id: bookId ,isDeleted: false}).lean()
      if (!bookData) {
          return res.status(404).send({ status: false, message: "Book does not Exist, Please enter Valid Book ID" })
      }

      const reviewData = await reviewModel.findOne({ _id: reviewId , isDeleted: false})
      if (!reviewData) {
          return res.status(404).send({ status: false, message: "Review does not Exist, Please enter Valid ID" })
      }

      if (reviewData['bookId'] != bookId) {
          return res.status(400).send({ status: false, msg: "Review does not Exist with this BookId" });
      }

      const { review, rating, reviewedBy} = reqBody

      if (review && !isValid2(review)) {
          return res.status(400).send({ status: false, msg: "Please enter Valid Review" })
      }

      if (!isValid(rating)) {
          return res.status(400).send({ status: false, msg: "Rating is Required" });
      }

      if (!isValidRating(rating)) {
          return res.status(400).send({ status: false, msg: "Please Enter Rating between 1-5 Number" });
      }

      if (!isValid(reviewedBy)) {
          return res.status(400).send({ status: false, msg: "Reviewer's name is Required" });
      }

      // if (!isValid2(reviewedBy)) {
      //     return res.status(400).send({ status: false, msg: "Please enter Valid Name" })
      // }

      const reviewDetails = await reviewModel.findOneAndUpdate(
          {_id: reviewId}, 
          reqBody, 
          {new: true})
  
      // use spread operator for adding keys
      // const{...data} = bookData;

       // adding key reviewsaData;
      bookData.reviewsData = reviewDetails ;
      return res.status(201).send({status:true, message:"Review Updated Successfully", data: bookData })
  }
  catch(err){
      return res.status(500).send({ status: false, message: "server error", error: err.message });
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



module.exports = { addReview,deleteReview ,updateReview};
