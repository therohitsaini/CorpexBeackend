const express = require("express")
const { CreateHeadingAndUpdate, getHeadingData } = require("../Controller/adminHeadingController")
const headingTopRoutes = express.Router()



headingTopRoutes.put("/api-headingtop-api/:id", CreateHeadingAndUpdate)
headingTopRoutes.get("/api-get-heading-top/:id", getHeadingData)

module.exports = {
    headingTopRoutes
}