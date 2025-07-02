const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({

    fullname: {
        type: String
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    permission: {
        type: String
    },
    role: {
        type: String, default: "user"
    },
    dateofbirth: {
        type: Object, default: ""
    },
    contactnumber: {
        type: String, default: ""
    },
    city: {
        type: String, default: ""
    },
    state: {
        type: String, default: ""
    },
    country: {
        type: String, default: ""
    },
    zipCode: {
        type: String, default: ""
    },
    gender: {
        type: String, default: ""
    },
    current_Data: {
        type: Object, default: new Date()
    },
    path: {
        type: String,
    },
    filename: {
        type: String,
    },
    userStatus: {
        type: Boolean, default: true
    },
    marriedStatus: {
        type: String
    },
    occupation: {
        type: String
    },
    companyName: {
        type: String
    },
    workExperience: {
        type: String
    },
    linkdinUrl: {
        type: String
    },
    twiterUrl: {
        type: String
    },
    instagramUrl: {
        type: String
    },


})

const UserData_ = mongoose.model("userDetails", userSchema)

module.exports = { UserData_ }