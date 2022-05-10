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

  module.exports.createBook=createBook