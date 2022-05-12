const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const {
  isValidObjectId,
  isValidBody,
  validStr,
} = require("../validations/validator");

//========================= POST /books/:bookId/review===================//

const getReview = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    if (!isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid book id" });

    if (validStr(data.reviewedBy) || validString(data.review)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Enter the name  properly and fill the review",
        });
    }

    let checkBookId = await bookModel.findById(bookId);
    if (!checkBookId)
      return res
        .status(404)
        .send({ status: false, message: "Book is not present in DB" });

    if (checkBookId.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, message: "Book is already deleted" });

    let data = req.body;
    if (isValidBody(data))
      return res
        .status(400)
        .send({ status: false, message: "Enter the Details in the body" });

    if (!data.rating)
      return res
        .status(400)
        .send({ status: false, message: "please Give the rating" });

    if (!validStr(data.rating))
      return res
        .status(400)
        .send({ status: false, message: "rating must be in number" });

    if (!(data.rating < 6 && data.rating > 0))
      return res
        .status(400)
        .send({ status: false, message: "give rating out of 5" });

    data.bookId = bookId;

    let showReviewData = await reviewModel.create(data);
    await bookModel.findByIdAndUpdate(
      { _id: bookId },
      { $inc: { reviews: 1 } }
    );

    res
      .status(200)
      .send({ status: true, message: "Success", data: showReviewData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};



//---------------PUT /books/:bookId/review/:reviewId

const updateReview = async (req, res) => {
  try {
    let getID = req.params

    if(!isValidObjectId(getID.bookId)) return res.status(400).send({ status: false, message: "Enter a valid Book id" });
    if(!isValidObjectId(getID.reviewId)) return res.status(400).send({ status: false, message: "Enter a valid Review id" });

    let checkID = await reviewModel.findOne({ _id: getID.reviewId, bookId: getID.bookId });
    if(!checkID) return res.status(404).send({ status: false, message: "Data not found, check ID's and try again" });

    if(checkID.isDeleted == true) return res.status(404).send({ status: false, message: "Review not found or might have been deleted" });

    let data = req.body;
    if(isValidBody(data)) return res.status(400).send({ status: false, message: "Data is required to update document" });

    

    if (validStr(data.reviewedBy) || validStr(data.review)) {
      return res.status(400).send({ status: false, message: "Enter valid data in review and reviewedBy" })
    }

   
    
    await reviewModel.findByIdAndUpdate(
      {_id: getID.reviewId},
      data,
    )

    let getReviews = await reviewModel.find({ bookId: getID.bookId, isDeleted: false }).select({ isDeleted: 0, __v: 0, createdAt: 0, updatedAt: 0 });
    let getBook = await bookModel.findById(getID.bookId).select({ __v: 0 });

    getBook._doc.reviewData = getReviews
 
    res.status(200).send({ status: true, message: "Book list", data: getBook }); 
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}






module.exports = { getReview ,updateReview};
