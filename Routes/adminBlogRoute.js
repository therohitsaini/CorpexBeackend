const express = require("express")
const { updateAndCreateBlogStore, getBlogHeading, postBlogInformation, getBlogData, deleteBlogData, getBlogDataForUpdate, updateBlogData } = require("../Controller/adminBlogController")
const { siteupload, upload } = require("../Middleware/FileStorage")
const blogRoute = express.Router()


blogRoute.put("/api-create-update/bloges/:id", updateAndCreateBlogStore)
blogRoute.put("/api-create-update/bloges/:id/:sectionId", updateAndCreateBlogStore)
blogRoute.get("/api-get-heading-data/:id", getBlogHeading)
blogRoute.post("/api-post-blog-Card/:id", siteupload.single("blogerImage"), postBlogInformation)
blogRoute.get("/api-get-blog/:id", getBlogData)
blogRoute.delete("/api-delete-blog/", deleteBlogData)
blogRoute.get("/api-get-chlid-docs/:id/:docsId", getBlogDataForUpdate)
blogRoute.put("/api-updatedocs/:id/:userDocID", siteupload.single("blogerImage"), updateBlogData)


module.exports = {
    blogRoute
}