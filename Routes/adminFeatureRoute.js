const express = require("express")
const { updateAndCreateFeatureSection, updateAndCreateFeatureSectionStore, getFeatureSection, postFeatureSectionListItem, getFeatureSectionListItem, deleteFeatureListItem, updateFeatureListItem } = require("../Controller/adminFeatureSection")
const { siteupload, upload } = require("../Middleware/FileStorage")
const featureRoutes = express.Router()



featureRoutes.put("/api-create-update/:id/:sectionId", siteupload.single("setionImage"), updateAndCreateFeatureSectionStore)
featureRoutes.get("/api-get/:id/", getFeatureSection)
featureRoutes.post("/api-post-list-item/:id", siteupload.single("backGroundImage"), postFeatureSectionListItem)
featureRoutes.get("/api-get-list-item/:id", getFeatureSectionListItem)
featureRoutes.delete("/api-delete/feature/", deleteFeatureListItem)
featureRoutes.put("/api-update/feature-list-item/:userId/:userDocID", siteupload.single("backGroundImage"), updateFeatureListItem)

module.exports = {
    featureRoutes
}