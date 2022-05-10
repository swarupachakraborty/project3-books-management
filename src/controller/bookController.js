const BookModel=require("../models/bookModel")
const UserModel= require("../models/userModel")
const mongoose = require('mongoose');

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
  else  return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createBook = async function (req, res) {
    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "enter title in the body" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "enter excerpt in the body" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "enter userId" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "enter valid userId" })
        }
        const userid = await userModel.findById({ _id: userId })
        if (!userid) {
            return res.status(400).send({ status: false, msg: "given user is not present please enter valid userid" })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "enter ISBN" })
        }

        const validISBN = await bookModel.findOne({ ISBN })
        if (validISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is already exist" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "enter category" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "enter subcategory" })
        }

        const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

        if (!(dateRegex.test(releasedAt.trim()))) {
            res.status(400).send({ status: false, message: `Date should be in valid format` })
            return
        }

        const validTitle = await bookModel.findOne({ title })
        if (validTitle) {
            return res.status(400).send({ status: false, msg: "title is already exist" })
        }


        const createDataBook = await bookModel.create(data)
        return res.status(201).send({ msg: "sucessfully created", data: createDataBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

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
                    filterquery['category'] = category.trim()
                }

                if (isValid(subcategory)) {

                    filterquery['subcategory'] = subcategory.trim()

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


module.exports.createBook=createBook
module.exports.getBooksByQuery=getBooksByQuery




