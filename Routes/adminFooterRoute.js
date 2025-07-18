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
    getFooterSponsors,
    updateFooterSponsors,
    createFooterSponsors,
    createFooterTopBar,
    getFooterTopBar,
    getFooterHelpCenterForm,
    getAllFooterData,
    getFooterCopyRight,
    createUpdateFooterCopyRight,
    deleteIconById,
    deleteMultipleIcons,
    deleteEntireFooter
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

// New Footer Sponsors Management routes (matching frontend requirements)
footerRoute.get("/get-footer-sponsors/:id", getFooterSponsors);
footerRoute.put("/update-footer-sponsors/:id", upload.fields([
    { name: "Image_one", maxCount: 1 },
    { name: "Image_two", maxCount: 1 },
    { name: "Image_three", maxCount: 1 },
    { name: "Image_four", maxCount: 1 },
    { name: "Image_five", maxCount: 1 }
]), updateFooterSponsors);
footerRoute.post("/create-footer-sponsors/:id", upload.fields([
    { name: "Image_one", maxCount: 1 },
    { name: "Image_two", maxCount: 1 },
    { name: "Image_three", maxCount: 1 },
    { name: "Image_four", maxCount: 1 },
    { name: "Image_five", maxCount: 1 }
]), createFooterSponsors);

// Footer Top Bar routes
footerRoute.post("/footer-top-bar/:id", upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
]), createFooterTopBar);

footerRoute.get("/get-footer-top-bar/:id", getFooterTopBar);

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



footerRoute.get("/footer-help-center-form/:userId", getFooterHelpCenterForm);

// Footer All Data routes
footerRoute.get("/footer-all-data/:userId", getAllFooterData);

// Footer Copyright routes
footerRoute.get("/api-get-footer-data/:userId", getFooterCopyRight);
footerRoute.put("/api-create-update-footer/:userId", createUpdateFooterCopyRight);

// Footer Copyright Delete routes
footerRoute.delete("/api-delete-icon-by-id/:userId/:iconId", deleteIconById);
footerRoute.delete("/api-delete-footer-icons/:userId/:footerId", deleteMultipleIcons);
footerRoute.delete("/api-delete-footer/:userId/:footerId", deleteEntireFooter);

module.exports = {
    footerRoute
};