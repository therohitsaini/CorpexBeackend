const express = require("express")
const { getFunfactID, funfactUpdate, deleteFunfactItem, updateFunfactID } = require("../Controller/adminFunfactController")
const funfactRoute = express.Router()



funfactRoute.get("/funfact-get/:id", getFunfactID)
funfactRoute.put("/funfact-section/:id", funfactUpdate)
funfactRoute.delete("/funfact-delete/", deleteFunfactItem)
funfactRoute.put("/update/funfact/:userId/:userDocID", updateFunfactID)


module.exports = {
    funfactRoute
}