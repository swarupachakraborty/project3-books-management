const mongoose = require('mongoose')
const userModel= require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const{isValidObjectId,isValidRequestBody,isValid} = require('../validations/validator')


//=================CREATE BOOK =====================================
const createBook = async (req, res) => {

  try {
      // Extract body 
      const reqBody = req.body;

      // Object Destructing
      const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews,isDeleted
      } = reqBody;

      // Check data is coming or not
      if (!isValidRequestBody(reqBody)) {
          return res.status(400).send({ status: false, message: "Please Enter the All Book Details" })
      }

      // Check title is coming or not
      if (!isValid(title)) {
          return res.status(400).send({ status: false, message: 'Title is Required' });
      }
      
      // Check duplicate title
      const duplicateTitle = await bookModel.findOne({ title: title })
      if (duplicateTitle) {
          return res.status(400).send({ status: false, message: "Title is Already presents" })
      }

      // Check excerpt is coming or not 
      if (!isValid(excerpt)) {
          return res.status(400).send({ status: false, message: 'Excerpt is Required' });
      }

     

      // Check userId is coming or not
      if (!isValid(userId)) {
          return res.status(400).send({ status: false, message: 'userId is Required' });
      }

      // Check userId is valid or not
      if (!isValidObjectId(userId)) {
          return res.status(400).send({ status: false, message: 'Please enter valid user ID' });
      }

      // Check Duplicate UserId
      const duplicateUserId = await userModel.findOne({ userId: userId });
      if (!duplicateUserId) {
          return res.status(400).send({ status: true, message: "User ID is Not exists in our Database" })
      }

      // Check ISBN is coming or not
      if (! isValid(ISBN)) {
          return res.status(400).send({ status: false, message: 'ISBN is Required' });
      }

      // Check ISBN is valid or not
      let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
      if (! reISBN.test(ISBN)){
          return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
      }

      const duplicateISBN = await bookModel.findOne({ ISBN:ISBN })
      if (duplicateISBN) {
          return res.status(400).send({ status: false, message: "ISBN is Already presents" })
      }

 // Check category is coming or not
      if (!isValid(category)) {
          return res.status(400).send({ status: false, message: 'category is Required' });
      }
 // Check subcategory is coming or not
      if (!isValid(subcategory)) {
          return res.status(400).send({ status: false, message: 'subcategory is Required' });
      }
// Check releasedAt is coming or not
      if (!isValid(releasedAt)) {
          return res.status(400).send({ status: false, message: 'Please Enter Released Date' });
      }
// Check releasedAt Value should be in given format
      let reAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;// YYYY-MM-DD
      if (!reAt.test(releasedAt)) {
          return res.status(400).send({ status: false, message: "Released Date Format Should be in 'YYYY-MM-DD' Format " });
      }
// Valid reviews when reviews are coming
      if (reviews && (typeof reviews !== 'number')) {
          return res.status(400).send({ status: false, message: "Reviews Must be numbers" })
      }
// Check if isDeleted true
      if(isDeleted === true){
          return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
      }
 // After All Successful Validation then Create Book
      const bookDetails = await bookModel.create(reqBody)
      return res.status(201).send({ status: true, message: 'successfully created ', data: { bookDetails } })
          
  } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: err.message })  
};
 }
//--------------------------GET BOOK BY QUERY--------------------------------------------------

const getBooks = async function (req, res) {
  try {
     const query = req.query
      const { userId, category, subcategory } = query
      // user id vlidation 
      if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).send({ status: false, msg: "userid not valid" })
      }

  //     if (!isValid(category)) {
  //       return res.status(400).send({ status: false, message: 'category is Required' });
  //   }

  //   if (!isValid(subcategory)) {
  //     return res.status(400).send({ status: false, message: 'subcategory is Required' });
  // }

      // filtering by query
      const filterdBooks = await bookModel.find({ $and: [{ isDeleted: false }, query] })
          .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 });

      if (!filterdBooks.length) {
          return res.status(400).send({ status: false, msg: "No Book exist" })
      }
      // sorting name  by Alphabitical
      const sortedBooks = filterdBooks.sort((a, b) => a.title.localeCompare(b.title))

      res.status(200).send({ status: true, msg: "all books", data: sortedBooks })

  } catch (error) {
      res.status(500).send({ status: false, error: error.message })
  }
};

//---------------------GET BOOK BY ID-------------------------------------------------

const getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Enter a correct book id" });

    let getBook = await bookModel.findById(bookId).select({ __v: 0 });
    if (!getBook) return res.status(404).send({ status: false, message: "No book found" })

    if(getBook.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found or have already been deleted" })

    let getReviews = await reviewModel.find({ bookId: getBook._id, isDeleted: false }).select({ isDeleted: 0, __v: 0, createdAt: 0, updatedAt: 0 });

    getBook._doc.reviewsData = getReviews

    res.status(200).send({ status: true, message: "Books list", data: getBook })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

//updateBook

const updateBook = async function (req, res) {
    try {
      const bookId = req.params.bookId;
      if (!bookId)
        return res.status(404).send({ status: false, msg: "No Book Found" });
      if (!isValid(bookId))
        return res.status(404).send({ status: false, msg: "BookID invalid" });
  
      const bookFound = await bookModel.findById(bookId);
      if (bookFound.isDeleted === true) {
        return res.status(404).send({ Status: "false", msg: "bookis deleted " });
      }
  
      //*Extracts Param
      const title = req.body.title;          
      const  excerpt= req.body.excerpt;
      const releasedate = req.body.releasedate;
      const ISBN = req.body.ISBN;
     
  
      if (title || excerpt|| releasedate || ISBN ) {
        const updatedBook = await bookModel.findOneAndUpdate(
          { _id: bookId },
          {
            title: title,
            excerpt:excerpt,
            releasedate:releasedate,
            ISBN:ISBN,
            
           
            isPublished: true,
            publishedAt: new Date(),
          },
          { new: true }
        );
  
        //*Validation
        if (!updatedBook) return res.status(404).send({ msg: "Book not found" });
        res
          .status(200)
          .send({ status: true, msg: "Updated successfully", data: updatedBook });
      } else {
        res.status(400).send({ msg: "data is required in body " });
      }
    } catch (err) {
      res
        .status(500)
        .send({ status: false, msg: "server Error", err: err.message });
    }
  };
  
//----------------------DeleteBook ById---------------------------------------

const deleteBooks = async (req, res)=> {
  try {
   let bookId = req.params.bookId; //getting the bookId from the request params
  
    //validating the bookId to check whether it is valid or not
    if(!isValidObjectId(bookId)) return res.status(404).send({ status: false, msg: "Enter a valid book Id" });

    let data = await bookModel.findById(bookId); //finding the bookId in the database to check whether it is valid or not
    if (!data)return res.status(404).send({ status: false, msg: "No such book found" });

    //Verify that the document is deleted or not
    if (data.isDeleted) return res.status(404).send({ status: false, msg: "No such book found or has already been deleted" });

    let timeStamps = new Date(); //getting the current timeStamps

    //updating the isDeleted to true, isPublished to false and deletedAt to the current timeStamps
    await bookModel.findOneAndUpdate({_id:bookId},{isDeleted:true, isPublished: false, deletedAt: timeStamps})
    res.status(200).send({status:true,msg:"Book is deleted successfully" ,data})
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};







  module.exports.createBook=createBook
  module.exports.getBooks = getBooks
  module.exports.getBookById = getBookById
  module.exports.updateBook= updateBook
  module.exports.deleteBooks = deleteBooks




















