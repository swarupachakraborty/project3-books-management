const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel")
const isValid = mongoose.Types.ObjectId.isValid

//*User-Authentication

const authentication = async function(req, res, next) {
    try{
    //here using token we validate the user 
    let token = req.headers["x-Api-Key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
    
//*Token decoded 

    let decodedToken = jwt.verify(token,  "My private key");
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });

//*To check valid User-ID Input

    let userId= req.params.userId
    if(!isValid(userId)) return res.status(404).send({ status: false, msg: "userId invalid" })

//*To check Author Exist or not

    let user= await userModel.findById(userId);
    if (!user) return res.status(404).send("No such user exists");
    }
    catch (err) {res.status(500).send({ msg: "server error", error: err.message })}
    next()
}


module.exports.authentication= authentication



