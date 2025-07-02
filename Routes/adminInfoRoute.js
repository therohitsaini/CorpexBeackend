const express = require("express")
const { UpdateInFo, getInFo, deleteInFoItem, updateInFoID } = require("../Controller/adminInFoController")
const adminInfoRoute = express.Router()

adminInfoRoute.put("/update-info/:id", UpdateInFo)
adminInfoRoute.get("/get/info/:id", getInFo)
adminInfoRoute.delete("/delete-info/", deleteInFoItem)
adminInfoRoute.put("/update-docs/:userId/:userDocID", updateInFoID)

module.exports = {
    adminInfoRoute
}