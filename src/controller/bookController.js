const bookModel= require('../models/bookModel')
const userModel= require('../models/userModel')
const mongoose = require('mongoose')
const moment=require('moment')
//const ISBN = require('isbn-validate')
let ObjectId=mongoose.Types.ObjectId


const isValid = function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
  }
  
  const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
  }
  
  const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }
  
  //=================CREATE BOOK =====================================

  const createBook = async function (req, res) {
  
     try {
      let requestBody = req.body;
  
      if(!isValidRequestBody(requestBody)){
        res.status(400).send({status: false, message:`Invalid request parameters, please provide blog details`})
        return
      }
  
      //Extract params
      const {title, excerpt, userId, ISBN, category,subcategory} = requestBody;
  
      //Validation starts
      if(!isValid(title)){
        res.status(400).send({status:false, message:'Book Title is required'})
        return
      }
  
      if(!isValid(excerpt)){
        res.status(400).send({status:false, message:'Book excerpt is required'})
        return
      }
  
      if(!isValid(userId)){
        res.status(400).send({status:false, message:'User id is required'})
        return
      }
  
      if(!isValidObjectId(userId)){
        res.status(400).send({status:false, message:'${userId} is not a valid user id'})
        return
      }

      if(!isValid(ISBN)){
          res.status(400).send({status:false, message:'ISBN is required'})
      }
  
  
      if(!isValid(category)){
        res.status(400).send({status:false, message:'Book category is required'})
        return
      }

      if(!isValid(subcategory)){
          res.status(400).send({status:false, message:'Book subcategory is required'})
      }
  
      const user = await userModel.findById(userId);
  
      if(!user){
        res.status(400).send({status:false, message:`user does not exit`})
        return
      }
  
      //validation ends
 
  
    const newBook = await bookModel.create(requestBody)
    res.status(201).send({status:true, message:'New Book created successfully', data:newBook})
  
    } catch (error) {
      res.status( 500 ).send({status:false, msg: error.message})
    }
  }

  //=======================GET BOOK BY QUERY=====================================

  const getBooksByQuery = async function (req, res) {
    try {
        let filterquery = { isDeleted: false }
        let queryParams = req.query
        const { userId, category, subcategory } = queryParams
        if (userId || category || subcategory) {
            if (isValidRequestBody(queryParams)) {


                if (queryParams.userId && isValidObjectId(userId)) {
                    filterquery['userId'] = userId
                }

                if (isValid(category)) {
                    filterquery['category'] = category
                }

                if (isValid(subcategory)) {

                    filterquery['subcategory'] = subcategory

                }
            }

        }

        const Bookks = await bookModel.findOne(filterquery)
        if (!Bookks) {
            return res.status(404).send({ status: false, msg: "No books found" })

        }

        const books = await bookModel.find(filterquery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1 })
        let sortedb = books.sort((a, b) => a.title.localeCompare(b.title));

        // const sortedb = books.sort()//using sorting technique
        const count = books.length


        return res.status(200).send({ status: true, NumberofBooks: count, msg: "books list", data: sortedb })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

///====================GET BOOK BY ID====================================



const getBookById = async function (req, res) {
  try {
      const bookId = req.params.bookId;

      let findBook = await bookModel.findById({ _id: bookId,isDeleted:false})
      if (!findBook) {
          return res.status(404).send({ status: false, message: "No data Found,please check the id and try again" })
      }
      let review = await bookModel.find({ bookId: bookId })
      data1 = { findBook }

      return res.status(200).send({status:true,message:"Books list", data:{data1}})
  }
  catch(err){
      return res.status(500).send({ status: false, message: "server error", error: err.message });
  }
}


  module.exports.createBook=createBook
  module.exports.getBooksByQuery = getBooksByQuery
  module.exports.getBookById = getBookById



















  // const getBooksById = async function(req, res){
//     try{
//       const bookId = req.params.bookId;
//       if(!bookId) return res.status(404).send({status:false, msg:"book not found"});
      
//       if(isValid(bookId))return res.status(400).send({status:false, msg:"bookId is invalid"}) ;
    
//    const bookFound = await bookModel.findOne({bookId});
//     if(bookFound.isDeleted===true){
//       return res.status(404).send({status:false, msg :" book is not available"})
//     }

// elseif(bookFound.is)


//     }
// }