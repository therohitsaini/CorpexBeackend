const express = require("express");
const {
   updateFooterSponsorsById,
   getFooterSponsor,
   updateFooterBackground,
   getFooterBackground,
   createFooterCategory,
   getFooterCategories,
   updateFooterCategory,
   createFooterTags,
   getFooterTags,
   updateFooterTags,
   createFooterContact,
   getFooterContact,
   updateFooterContact,
   deleteFooterContact,
   deleteFooterContactIcon,
   createFooterRightContact,
   getFooterRightContact,
   updateFooterRightContact,
   deleteFooterRightContact,
   createFooterHelpCenter,
   getFooterHelpCenter,
   updateFooterHelpCenter,
   createFooterTopBar,
   getFooterTopBar
} = require("../Controller/adminFooterController");
const { upload, siteupload } = require("../Middleware/FileStorage");

const footerRoute = express.Router();

// Footer Sponsors routes
footerRoute.put("/update-sponsors/:id", upload.fields([
    { name: "sponsorsOne", maxCount: 1 },
    { name: "sponsorsTwo", maxCount: 1 },
    { name: "sponsorsThree", maxCount: 1 },
    { name: "sponsorsFour", maxCount: 1 },
    { name: "sponsorsFive", maxCount: 1 }
]), updateFooterSponsorsById);

footerRoute.get("/get-sponsors/:id", getFooterSponsor);

footerRoute.put("/update-footer-background/:id", siteupload.fields([
    { name: "backgroundImage", maxCount: 1 }
]), updateFooterBackground);

footerRoute.get("/get-footer-background/:id", getFooterBackground);

footerRoute.post("/api-footer/post", createFooterCategory);
footerRoute.get("/api-footer-get/:userId", getFooterCategories);
footerRoute.put("/api-footer-update/:categoryId", updateFooterCategory);

// Footer Tags routes
footerRoute.post("/api-footer-tags/post", createFooterTags);   
footerRoute.get("/api-footer-tags-get/:userId", getFooterTags);
footerRoute.put("/api-footer-tags-update/:tagsId", updateFooterTags);

// Footer Contact routes
footerRoute.post("/footer-contact/post", siteupload.fields([
    { name: "logo", maxCount: 1 }
]), createFooterContact);
footerRoute.get("/footer-contact/get", getFooterContact);
footerRoute.put("/footer-contact/update/:contactId", siteupload.fields([
    { name: "logo", maxCount: 1 }
]), updateFooterContact);
footerRoute.delete("/footer-contact/delete/:contactId", deleteFooterContact);
footerRoute.delete("/footer-contact/:contactId/icon/:iconId", deleteFooterContactIcon);

// Footer Right Contact routes
footerRoute.post("/footer-right-contact/post", createFooterRightContact);
footerRoute.get("/footer-right-contact/get", getFooterRightContact);
footerRoute.put("/footer-right-contact/update/:contactId", updateFooterRightContact);
footerRoute.delete("/footer-right-contact/delete/:contactId", deleteFooterRightContact);

// Footer Help Center routes
footerRoute.post("/footer-help-center/:userId", siteupload.fields([
    { name: "leftSection[image]", maxCount: 1 },
    { name: "rightSection[image]", maxCount: 1 }
]), createFooterHelpCenter);
footerRoute.get("/footer-help-center/:userId", getFooterHelpCenter);
footerRoute.put("/footer-help-center/:userId/:helpCenterId", siteupload.fields([
    { name: "leftSection[image]", maxCount: 1 },
    { name: "rightSection[image]", maxCount: 1 }
]), updateFooterHelpCenter);

// Additional routes for frontend compatibility
footerRoute.get("/get/FooterHelpCenter/:userId", getFooterHelpCenter);
footerRoute.get("/get/FooterHelpCenter", getFooterHelpCenter);
footerRoute.get("/footer-section/get/FooterHelpCenter", getFooterHelpCenter);
footerRoute.post("/footer-section/create", createFooterHelpCenter);
footerRoute.put("/footer-section/update/:helpCenterId", updateFooterHelpCenter);

// Footer Top Bar routes
footerRoute.post("/footer-top-bar/:userId", siteupload.fields([
    { name: "image", maxCount: 1 }
]), createFooterTopBar);
footerRoute.get("/footer-top-bar/:userId", getFooterTopBar);

module.exports = {
   footerRoute
};