const express = require("express")
const { postTestimonialSection, getTestimonial, updateTestimonilaData, getDataTestimonialForUpdate } = require("../Controller/adminTestimonialController")
const { siteupload, upload } = require("../Middleware/FileStorage")
const testimonialRoute = express.Router()



testimonialRoute.post("/api/testimonial/:id", siteupload.single("userProfile"), postTestimonialSection)
testimonialRoute.get("/get-testimonial/:id", getTestimonial)
testimonialRoute.put("/api-update/:id/:userDocID", upload.single("userImage"), updateTestimonilaData)
testimonialRoute.get("/api-get-data/by-doc-id/:id/:docsId", getDataTestimonialForUpdate)


module.exports = {
    testimonialRoute
}