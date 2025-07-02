const express = require("express")
const { ServiceCardUpdate, getSeriveCardDataID, deleteServiceItem, getServiceCardByID, updateServiceIDM } = require("../Controller/adminServiceController")
const serviceCardRoute = express.Router()





serviceCardRoute.put("/service-card/:id", ServiceCardUpdate)
serviceCardRoute.get("/get-servcie-card/:id", getSeriveCardDataID)
serviceCardRoute.delete("/delete-serive-item", deleteServiceItem)
serviceCardRoute.get("/get-data/by-id/:parentId/:cardId", getServiceCardByID)
serviceCardRoute.put("/update-service/card-by-id/:userId/:userDocID", updateServiceIDM)

module.exports = {
    serviceCardRoute
}