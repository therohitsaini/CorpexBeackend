const express = require("express")
const { updateAndCreateFeatureSection, updateAndCreateFeatureSectionStore } = require("../Controller/adminFeatureSection")
const { siteupload } = require("../Middleware/FileStorage")
const featureRoutes = express.Router()



featureRoutes.put("/api-create-update/:id", siteupload.single("setionImage"), updateAndCreateFeatureSectionStore)

module.exports = {
    featureRoutes
}