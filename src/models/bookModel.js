const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "usersdatas"
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (ISBN) {
                return /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)
            }, message: 'Please fill a valid mobile number', isSync: true
        }
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String],
        required: true
    },
    reviews: {
        type: Number,
        default: 0,
        //   comment
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required:true
    },
    deletedAt:{
        type:Date,
        default:null
    }

}, { timestamps: true })

module.exports = mongoose.model("books", bookSchema)
