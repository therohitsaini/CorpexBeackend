
const mongoose = require("mongoose")
require("dotenv").config()
const url = process.env.MONGO_DB_URL_

const connectDB = () => mongoose.connect(url)
    .then(() => {
        console.log("Mongoose Server Is Connected...! ")
    }).catch(err => {
        console.log("Mongoose Server Error...! ", err)
    })

module.exports = { connectDB }