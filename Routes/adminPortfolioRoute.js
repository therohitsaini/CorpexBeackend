const express = require("express")
const { postPortfolioSection, getPortfolioPost, deletePortData, updatePortfoliorData } = require("../Controller/adminPortfolioController")
const { siteupload } = require("../Middleware/FileStorage")
const portfolioSectionRoutes = express.Router()



portfolioSectionRoutes.post("/portfolio/api/:id", siteupload.single('userImage'), postPortfolioSection)
portfolioSectionRoutes.get("/get-portfolio/:id", getPortfolioPost)
portfolioSectionRoutes.delete("/delete-portfolio/", deletePortData)
portfolioSectionRoutes.put("/update-port-folio/:userId/:userDocID", siteupload.single('userImage'), updatePortfoliorData)


module.exports = {
    portfolioSectionRoutes
}