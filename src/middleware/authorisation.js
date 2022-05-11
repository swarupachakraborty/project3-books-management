const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const isValid = mongoose.Types.ObjectId.isValid;

//*User-Authorisation
const authorisation = function (req, res, next) {
  try {
//*Here using Token we validate the user

    let token = req.headers["x-Api-Key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token)return res.status(400).send({ status: false, msg: "token must be present" });

//*Token Decoded

    let decodedToken = jwt.verify(token, "My private key");
    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

//*To check valid User-ID input

    let userId = req.params.userId;
    if (!isValid(userId))return res.status(404).send({ status: false, msg: "UserId invalid" });

//*To check User is Authorised or not

    if (decodedToken.userId != userId) 
    return res.status(403).send({ msg: "you are not autherised for this process" });
  } 
  catch (err) {res.status(500).send({ msg: "server error", error: err.message });
  }

  next();
};

module.exports.authorisation = authorisation;