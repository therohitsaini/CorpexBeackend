const express = require("express")
const { postPrincingSection, getPrincingData, deletePrincingData, updatePrincingIDM, getDataPrincingForUpdate } = require("../Controller/adminPrincingController")
const adminPrincingRoute = express.Router()


adminPrincingRoute.post("/api/princing/:id", postPrincingSection)
adminPrincingRoute.get("/api-get/princing/:id", getPrincingData)
adminPrincingRoute.delete("/api-delete/", deletePrincingData)
adminPrincingRoute.put("/api-update/:userId/:userDocID", updatePrincingIDM)
adminPrincingRoute.get("/api-get-id/:userId/:docsId", getDataPrincingForUpdate)


module.exports = { adminPrincingRoute }
