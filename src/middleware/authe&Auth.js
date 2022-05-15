const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('../validations/validator');
const Books= require('../models/bookModel');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');

const authentication = (req, res, next) => {
  try {
    let token = req.headers['x-Api-key'];
    if (!token) {
      token = req.headers['x-api-key'];
    }
    if (!token) return res.status(400).send({ status: false, message: "Token is missing" });

    let decodedToken 
    jwt.verify(token, "My private key",function(error,securecode){

      if(error) return res.status(403).send({msg:error.message})
      decodedToken=securecode;
next();


    });
   // if (!decodedToken) return res.status(401).send({ status: false, message: "Token is incorrect" })

    //next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}



//------------
const authorization = async (req, res, next) => {
  try {
    let token = req.headers['x-Api-key'];
    token = req.headers['x-api-key'];

    let decodedToken = jwt.verify(token, "My private key");
    if (!decodedToken) return res.status(401).send({ status: false, message: "Token is incorrect" })

    let loggedInUser = decodedToken.userId;
    let userLogging;

    if (req.body.hasOwnProperty('userId')) {
      if (!isValidObjectId(req.body.userId)) return res.status(400).send({ status: false, message: "Enter a valid user id" });
      let userData = await userModel.findById(req.body.userId);
      if (!userData) return res.status(404).send({ status: false, message: "Error! Please check user id and try again" });
      userLogging = userData._id.toString();
    }
    if (req.params.hasOwnProperty('bookId')) {
      if (!isValidObjectId(req.params.bookId)) return res.status(400).send({ status: false, message: "Enter a valid book id" });
      let bookData = await bookModel.findById(req.params.bookId);
      if (!bookData) return res.status(404).send({ status: false, message: "Error! Please check book id and try again" });
      userLogging = bookData.userId.toString();
    }

    if (!userLogging) return res.status(400).send({ status: false, message: "User Id is required" });

    if (loggedInUser !== userLogging) return res.status(403).send({ status: false, message: 'Error, authorization failed' })
    next()
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}
module.exports = { authentication, authorization };