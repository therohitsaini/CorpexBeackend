const express = require("express")
const {

    headerIcone_Data_Update,
    getHeaderData,
    updateHeroSection,
    getHeroSectionDataID,
    deleteKeyDataByID,
    updateSliderData,
    deleteHeaderSection,
    logo_

} = require("../Controller/adminHeaderController")
const { siteupload, upload } = require("../Middleware/FileStorage")
const adminControllerRoute = express.Router()



adminControllerRoute.put("/header-top-bar/:id", headerIcone_Data_Update)
adminControllerRoute.get("/get-header-data/:id", getHeaderData)
adminControllerRoute.put("/hero-section/:id", siteupload.single('heroImg'), // "heroImg" is the field name in your form
    updateHeroSection
);
adminControllerRoute.post("/logo/logo/:id", siteupload.single('imageLogo'), logo_)
adminControllerRoute.delete("/delete-dyanamic-data/", deleteKeyDataByID)
adminControllerRoute.delete("/delete-header/list-item/", deleteHeaderSection)


adminControllerRoute.get("/get-hero-data/:id", getHeroSectionDataID)
adminControllerRoute.put("/slider-update/:userId/:userDocID", upload.single("image"), updateSliderData)


module.exports = {
    adminControllerRoute
}