const express = require("express")
const { updateAndCreateBlogStore, getBlogHeading, postBlogInformation, getBlogData } = require("../Controller/adminBlogController")
const { siteupload } = require("../Middleware/FileStorage")
const blogRoute = express.Router()


blogRoute.put("/api-create-update/bloges/:id", updateAndCreateBlogStore)
blogRoute.put("/api-create-update/bloges/:id/:sectionId", updateAndCreateBlogStore)
blogRoute.get("/api-get-heading-data/:id", getBlogHeading)
blogRoute.post("/api-post-blog-Card/:id", siteupload.single("blogerImage"), postBlogInformation)
blogRoute.get("/api-get-blog/:id",getBlogData)


module.exports = {
    blogRoute
}