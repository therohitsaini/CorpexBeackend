const express = require("express")
const cors = require("cors")
const { connectDB } = require("./Utils/db")
const { userRoute } = require("./Routes/userRoutes")
require("dotenv").config()
const nodemailer = require('nodemailer')
const { adminRoute } = require("./Routes/adminRoutes")
const PORT = process.env.BACKEND_PORT || 5001
const path_ = require("path")
const app = express()
app.use(cors())
app.use("/uploads", express.static(path_.join(__dirname, "/uploads")));
const { adminControllerRoute } = require("./Routes/adminHeaderRoute")
const { heroRoute } = require("./Routes/adminHeroRoute")
const { adminInfoRoute } = require("./Routes/adminInfoRoute")
const { serviceCardRoute } = require("./Routes/adminServiceRoute")
const { funfactRoute } = require("./Routes/adminFunfactRoute")
const { portfolioSectionRoutes } = require("./Routes/adminPortfolioRoute")
const { adminPrincingRoute } = require("./Routes/adminPrincingRoute")
const { testimonialRoute } = require("./Routes/adminTestimonilaRoute")
const { featureRoutes } = require("./Routes/adminFeatureRoute")
const { teamRoute } = require("./Routes/adminTeamRoute")
const { blogRoute } = require("./Routes/adminBlogRoute")
const { footerRoute } = require("./Routes/adminFooterRoute")
app.use(express.json())
app.use(express.static(path_.join(__dirname, "uploads")))
app.use('/uploadsStore', express.static(path_.join(__dirname, 'uploadsStore')));


connectDB()

app.use("/all", userRoute)
app.use("/admin", adminRoute);
app.use("/api/info", adminInfoRoute)
app.use("/admin-api", adminControllerRoute)
app.use("/admin-api", serviceCardRoute)
app.use("/admin-hero", heroRoute)
app.use("/api-funfact", funfactRoute)
app.use("/api-portfolio", portfolioSectionRoutes)
app.use("/api-princing", adminPrincingRoute)
app.use("/api/testimonial", testimonialRoute)
app.use("/api-feature", featureRoutes)
app.use("/api-team", teamRoute)
app.use("/api-blog", blogRoute)
app.use("/api-footer", footerRoute)
app.use("/api", footerRoute)


app.listen(PORT, () => {
    console.log(`Server is runing ${PORT}`)
})