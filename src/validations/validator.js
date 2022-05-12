const mongoose = require("mongoose")




const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
  };


  const validStr = (String) => {
    if (/\d/.test(String)) {
      return true
    } else {
      return false;
    };
  };


  const  isValidBody = (object) => {
    if (Object.keys(object).length > 0) {
      return false
    } else {
      return true;
    }
  };


module.exports = { isValidBody,isValidObjectId,validStr}