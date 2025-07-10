const express = require("express")
const { updateAndCreateTeamStore, getTeamHeading, postTeamInformation, getTeamCard, deleteTeamCardData } = require("../Controller/adminTeamController")
const { siteupload } = require("../Middleware/FileStorage")
const teamRoute = express.Router()


// teamRoute.put("/api-team/create-update/:id/:sectionId?", siteupload.single("teamBgImage"), updateAndCreateTeamStore)

// routes/teamRoutes.js or similar
teamRoute.put('/api-team/create-update/:id', siteupload.single('teamBgImage'), updateAndCreateTeamStore);
teamRoute.put('/api-team/create-update/:id/:sectionId', siteupload.single('teamBgImage'), updateAndCreateTeamStore);
teamRoute.get("/api-get/team-heading/:id", getTeamHeading)
teamRoute.post("/api-post-team/:id", siteupload.single("image"), postTeamInformation)
teamRoute.get("/api-get-team-card/:id", getTeamCard)
teamRoute.delete("/api-delete-team-card/",deleteTeamCardData)


module.exports = {
    teamRoute
}