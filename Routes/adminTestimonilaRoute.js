const express = require("express")
const { postTestimonialSection } = require("../Controller/adminTestimonialController")
const { siteupload } = require("../Middleware/FileStorage")
const testimonialRoute = express.Router()



testimonialRoute.post("/api/testimonial/:id", siteupload.single("userProfile"), postTestimonialSection)


module.exports = {
    testimonialRoute
}