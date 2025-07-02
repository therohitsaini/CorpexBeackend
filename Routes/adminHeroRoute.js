const express = require("express")
const { getHeroDataByID } = require("../Controller/adminHeroController")
const heroRoute = express.Router()



heroRoute.get("/get-hero-image/by-id/:id", getHeroDataByID)


module.exports = { heroRoute }