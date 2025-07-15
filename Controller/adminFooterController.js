const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");
const { ObjectId } = mongoose.Types;

const updateFooterSponsorsById = async (req, res) => {
    try {
        const { id } = req.params;

        const filePaths = {
            sponsorsOne: req.files["sponsorsOne"]?.[0]?.path || "",
            sponsorsTwo: req.files["sponsorsTwo"]?.[0]?.path || "",
            sponsorsThree: req.files["sponsorsThree"]?.[0]?.path || "",
            sponsorsFour: req.files["sponsorsFour"]?.[0]?.path || "",
            sponsorsFive: req.files["sponsorsFive"]?.[0]?.path || "",
        };

        const footer = await HeaderData.findById(id);

        if (!footer) {
            return res.status(404).json({ message: "Home data not found" });
        }

        const newSponsorData = {
            sponsorsOne: filePaths.sponsorsOne,
            sponsorsTwo: filePaths.sponsorsTwo,
            sponsorsThree: filePaths.sponsorsThree,
            sponsorsFour: filePaths.sponsorsFour,
            sponsorsFive: filePaths.sponsorsFive,
        };

        if (footer.FooterSponese.length > 0) {
            footer.FooterSponese[0] = newSponsorData;
        } else {
            footer.FooterSponese.push(newSponsorData);
        }

        await footer.save();

        res.status(200).json({ message: "Updated FooterSponese", data: footer.FooterSponese[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating FooterSponese", error: error.message });
    }
};

const getFooterSponsor = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const findDocs = await HeaderData.findById(id).select("FooterSponese");
        if (!findDocs || !findDocs.FooterSponese[0]) {
            return res.status(404).send({ message: "Data not found" });
        }

        const sponsorData = findDocs.FooterSponese[0];

        // Convert Windows path to URL-friendly path
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const formattedSponsors = {
            sponsorsOne: fixPath(sponsorData.sponsorsOne),
            sponsorsTwo: fixPath(sponsorData.sponsorsTwo),
            sponsorsThree: fixPath(sponsorData.sponsorsThree),
            sponsorsFour: fixPath(sponsorData.sponsorsFour),
            sponsorsFive: fixPath(sponsorData.sponsorsFive),
        };

        return res.status(200).json({ success: true, data: formattedSponsors });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateFooterBackground = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Handle file upload for background image
        let backgroundImagePath = "";
        if (req.files && req.files["backgroundImage"]) {
            backgroundImagePath = req.files["backgroundImage"][0].path;
        }

        // Update footer background data
        const updateData = {
            backgroundColor: req.body.backgroundColor || footer.FooterBackground?.backgroundColor || "",
            backgroundImage: backgroundImagePath || footer.FooterBackground?.backgroundImage || ""
        };

        // Update the document
        const updatedFooter = await HeaderData.findByIdAndUpdate(
            id,
            { FooterBackground: updateData },
            { new: true }
        );

        res.status(200).json({
            message: "Footer background updated successfully",
            data: updatedFooter.FooterBackground
        });

    } catch (error) {
        console.error("Error updating footer background:", error);
        res.status(500).json({
            message: "Error updating footer background",
            error: error.message
        });
    }
};

const getFooterBackground = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id).select("FooterBackground");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }


        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const footerBackground = {
            backgroundColor: footer.FooterBackground?.backgroundColor || "",
            backgroundImage: fixPath(footer.FooterBackground?.backgroundImage || "")
        };

        res.status(200).json({
            success: true,
            data: footerBackground
        });

    } catch (error) {
        console.error("Error getting footer background:", error);
        res.status(500).json({
            message: "Error getting footer background",
            error: error.message
        });
    }
};







// Footer Category APIs
const createFooterCategory = async (req, res) => {
    try {
        const { categoryName, listItem, userId } = req.body;

        if (!categoryName || categoryName.trim() === '') {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Get user ID from body, headers, or query params
        const userID = userId || req.headers['user-id'] || req.query.userId;

        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userID);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Check if category name already exists
        const existingCategory = footer.FooterCategory.find(
            cat => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
        );

        if (existingCategory) {
            return res.status(409).json({ message: "Category with this name already exists" });
        }

        // Create new footer category
        const newCategory = {
            categoryName: categoryName.trim(),
            listItem: Array.isArray(listItem) ? listItem : []
        };

        // Add to FooterCategory array
        footer.FooterCategory.push(newCategory);
        await footer.save();

        res.status(201).json({
            message: "Footer category created successfully",
            data: newCategory
        });

    } catch (error) {
        console.error("Error creating footer category:", error);
        res.status(500).json({
            message: "Error creating footer category",
            error: error.message
        });
    }
};

const getFooterCategories = async (req, res) => {
    try {
        // Get user ID from query params, headers, or body
        const { userId } = req.params

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in query params, user-id in headers, or userId in body"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterCategory");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        res.status(200).json({
            success: true,
            data: footer.FooterCategory
        });

    } catch (error) {
        console.error("Error getting footer categories:", error);
        res.status(500).json({
            message: "Error getting footer categories",
            error: error.message
        });
    }
};

const updateFooterCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { categoryName, listItem, userId } = req.body;

        if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        if (!categoryName || categoryName.trim() === '') {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Get user ID from body, headers, or query params
        const userID = userId || req.headers['user-id'] || req.query.userId;

        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userID);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific category in FooterCategory array
        const categoryIndex = footer.FooterCategory.findIndex(cat => cat._id.toString() === categoryId);

        if (categoryIndex === -1) {
            return res.status(404).json({ message: "Footer category not found" });
        }

        // Check if new category name conflicts with existing categories (excluding current one)
        const existingCategory = footer.FooterCategory.find(
            (cat, index) => index !== categoryIndex &&
                cat.categoryName.toLowerCase() === categoryName.toLowerCase()
        );

        if (existingCategory) {
            return res.status(409).json({ message: "Category with this name already exists" });
        }

        // Update the category
        footer.FooterCategory[categoryIndex] = {
            ...footer.FooterCategory[categoryIndex],
            categoryName: categoryName.trim(),
            listItem: Array.isArray(listItem) ? listItem : []
        };

        await footer.save();

        res.status(200).json({
            message: "Footer category updated successfully",
            data: footer.FooterCategory[categoryIndex]
        });

    } catch (error) {
        console.error("Error updating footer category:", error);
        res.status(500).json({
            message: "Error updating footer category",
            error: error.message
        });
    }
};



// post footer tages 
const createFooterTags = async (req, res) => {
    try {
        const { FooterTagesName, listItem, tagsId } = req.body;

        if (!FooterTagesName || FooterTagesName.trim() === '') {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Get user ID from body, headers, or query params
        const userID = tagsId || req.headers['tagsId-id'] || req.query.tagsId;

        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userID);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Check if category name already exists
        const existingCategory = footer.FooterTags.find(
            cat => cat.FooterTagesName.toLowerCase() === FooterTagesName.toLowerCase()
        );

        if (existingCategory) {
            return res.status(409).json({ message: "Category with this name already exists" });
        }

        // Create new footer category
        const newCategory = {
            FooterTagesName: FooterTagesName.trim(),
            listItem: Array.isArray(listItem) ? listItem : []
        };

        // Add to FooterCategory array
        footer.FooterTags.push(newCategory);
        await footer.save();

        res.status(201).json({
            message: "Footer Tags created successfully",
            data: newCategory
        });

    } catch (error) {
        console.error("Error creating footer Tags:", error);
        res.status(500).json({
            message: "Error creating footer Tags",
            error: error.message
        });
    }
};

const getFooterTags = async (req, res) => {
    try {
        // Get user ID from query params, headers, or body
        const { userId } = req.params

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in query params, user-id in headers, or userId in body"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterTags");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        res.status(200).json({
            success: true,
            data: footer.FooterTags
        });

    } catch (error) {
        console.error("Error getting footer categories:", error);
        res.status(500).json({
            message: "Error getting footer categories",
            error: error.message
        });
    }
};

const updateFooterTags = async (req, res) => {
    try {
        const { tagsId } = req.params;
        const { FooterTagesName, listItem, userId } = req.body;

        if (!tagsId || !mongoose.Types.ObjectId.isValid(tagsId)) {
            return res.status(400).json({ message: "Invalid tags ID" });
        }

        if (!FooterTagesName || FooterTagesName.trim() === '') {
            return res.status(400).json({ message: "Tags name is required" });
        }

        // Get user ID from body, headers, or query params
        const userID = userId || req.headers['user-id'] || req.query.userId;

        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userID);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific tag in FooterTags array
        const tagIndex = footer.FooterTags.findIndex(tag => tag._id.toString() === tagsId);

        if (tagIndex === -1) {
            return res.status(404).json({ message: "Footer tag not found" });
        }

        // Check if new tag name conflicts with existing tags (excluding current one)
        const existingTag = footer.FooterTags.find(
            (tag, index) => index !== tagIndex &&
                tag.FooterTagesName.toLowerCase() === FooterTagesName.toLowerCase()
        );

        if (existingTag) {
            return res.status(409).json({ message: "Tag with this name already exists" });
        }

        // Update the tag
        footer.FooterTags[tagIndex] = {
            ...footer.FooterTags[tagIndex],
            FooterTagesName: FooterTagesName.trim(),
            listItem: Array.isArray(listItem) ? listItem : []
        };

        await footer.save();

        res.status(200).json({
            message: "Footer tag updated successfully",
            data: footer.FooterTags[tagIndex]
        });

    } catch (error) {
        console.error("Error updating footer tag:", error);
        res.status(500).json({
            message: "Error updating footer tag",
            error: error.message
        });
    }
};

// Footer Contact APIs
const createFooterContact = async (req, res) => {
    try {
        const { description, icons, userId } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Handle file upload for logo
        let logoPath = "";
        if (req.files && req.files["logo"]) {
            logoPath = req.files["logo"][0].path;
        }

        // Parse icons data
        let iconsData = [];
        if (icons) {
            try {
                iconsData = JSON.parse(icons);
            } catch (error) {
                return res.status(400).json({ message: "Invalid icons data format" });
            }
        }

        // Create new footer contact
        const newContact = {
            description: description || "",
            logo: logoPath,
            icons: iconsData
        };

        // Add to FooterContact array
        footer.FooterContact.push(newContact);
        await footer.save();

        res.status(201).json({
            message: "Footer contact created successfully",
            data: newContact
        });

    } catch (error) {
        console.error("Error creating footer contact:", error);
        res.status(500).json({
            message: "Error creating footer contact",
            error: error.message
        });
    }
};

const getFooterContact = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterContact");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Convert Windows path to URL-friendly path for logo
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const footerContact = footer.FooterContact.length > 0 ? {
            ...footer.FooterContact[0].toObject(),
            logo: fixPath(footer.FooterContact[0].logo)
        } : null;

        res.status(200).json({
            success: true,
            data: footerContact
        });

    } catch (error) {
        console.error("Error getting footer contact:", error);
        res.status(500).json({
            message: "Error getting footer contact",
            error: error.message
        });
    }
};

const updateFooterContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { description, icons, userId } = req.body;

        if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific contact in FooterContact array
        const contactIndex = footer.FooterContact.findIndex(contact => contact._id.toString() === contactId);

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Footer contact not found" });
        }

        // Handle file upload for logo
        let logoPath = footer.FooterContact[contactIndex].logo;
        if (req.files && req.files["logo"]) {
            logoPath = req.files["logo"][0].path;
        }

        // Parse icons data
        let iconsData = footer.FooterContact[contactIndex].icons || [];
        if (icons) {
            try {
                iconsData = JSON.parse(icons);
            } catch (error) {
                return res.status(400).json({ message: "Invalid icons data format" });
            }
        }

        // Update the contact
        footer.FooterContact[contactIndex] = {
            ...footer.FooterContact[contactIndex],
            description: description || footer.FooterContact[contactIndex].description,
            logo: logoPath,
            icons: iconsData
        };

        await footer.save();

        // Convert Windows path to URL-friendly path for response
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const updatedContact = {
            ...footer.FooterContact[contactIndex].toObject(),
            logo: fixPath(footer.FooterContact[contactIndex].logo)
        };

        res.status(200).json({
            message: "Footer contact updated successfully",
            data: updatedContact
        });

    } catch (error) {
        console.error("Error updating footer contact:", error);
        res.status(500).json({
            message: "Error updating footer contact",
            error: error.message
        });
    }
};

const deleteFooterContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { userId } = req.body;

        if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific contact in FooterContact array
        const contactIndex = footer.FooterContact.findIndex(contact => contact._id.toString() === contactId);

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Footer contact not found" });
        }

        // Remove the contact from array
        footer.FooterContact.splice(contactIndex, 1);
        await footer.save();

        res.status(200).json({
            message: "Footer contact deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting footer contact:", error);
        res.status(500).json({
            message: "Error deleting footer contact",
            error: error.message
        });
    }
};

const deleteFooterContactIcon = async (req, res) => {
    try {
        const { contactId, iconId } = req.params;
        const { userId } = req.body;

        if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        if (!iconId || !mongoose.Types.ObjectId.isValid(iconId)) {
            return res.status(400).json({ message: "Invalid icon ID" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific contact in FooterContact array
        const contactIndex = footer.FooterContact.findIndex(contact => contact._id.toString() === contactId);

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Footer contact not found" });
        }

        // Find the specific icon in the icons array
        const iconIndex = footer.FooterContact[contactIndex].icons.findIndex(icon => icon._id.toString() === iconId);

        if (iconIndex === -1) {
            return res.status(404).json({ message: "Icon not found" });
        }

        // Remove the icon from the array
        footer.FooterContact[contactIndex].icons.splice(iconIndex, 1);
        await footer.save();

        res.status(200).json({
            message: "Icon deleted successfully",
            data: footer.FooterContact[contactIndex]
        });

    } catch (error) {
        console.error("Error deleting footer contact icon:", error);
        res.status(500).json({
            message: "Error deleting footer contact icon",
            error: error.message
        });
    }
};

// Footer Right Contact APIs
const createFooterRightContact = async (req, res) => {
    try {
        const { location, call, email, userId } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Create new footer right contact
        const newRightContact = {
            location: {
                icon: location?.icon || "",
                location: location?.location || "",
                address: location?.address || ""
            },
            call: {
                icon: call?.icon || "",
                call: call?.call || "",
                contactNumber: call?.contactNumber || ""
            },
            email: {
                icon: email?.icon || "",
                email: email?.email || "",
                emailId: email?.emailId || ""
            }
        };

        // Add to FooterRightContact array
        footer.FooterRightContact.push(newRightContact);
        await footer.save();

        res.status(201).json({
            message: "Footer right contact created successfully",
            data: newRightContact
        });

    } catch (error) {
        console.error("Error creating footer right contact:", error);
        res.status(500).json({
            message: "Error creating footer right contact",
            error: error.message
        });
    }
};

const getFooterRightContact = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterRightContact");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        const footerRightContact = footer.FooterRightContact.length > 0 ? footer.FooterRightContact[0] : null;

        res.status(200).json({
            success: true,
            data: footerRightContact
        });

    } catch (error) {
        console.error("Error getting footer right contact:", error);
        res.status(500).json({
            message: "Error getting footer right contact",
            error: error.message
        });
    }
};

const updateFooterRightContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { location, call, email, userId } = req.body;

        if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body, user-id in headers, or userId in query params"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific contact in FooterRightContact array
        const contactIndex = footer.FooterRightContact.findIndex(contact => contact._id.toString() === contactId);

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Footer right contact not found" });
        }

        // Update the contact
        footer.FooterRightContact[contactIndex] = {
            ...footer.FooterRightContact[contactIndex],
            location: {
                icon: location?.icon || footer.FooterRightContact[contactIndex].location?.icon || "",
                location: location?.location || footer.FooterRightContact[contactIndex].location?.location || "",
                address: location?.address || footer.FooterRightContact[contactIndex].location?.address || ""
            },
            call: {
                icon: call?.icon || footer.FooterRightContact[contactIndex].call?.icon || "",
                call: call?.call || footer.FooterRightContact[contactIndex].call?.call || "",
                contactNumber: call?.contactNumber || footer.FooterRightContact[contactIndex].call?.contactNumber || ""
            },
            email: {
                icon: email?.icon || footer.FooterRightContact[contactIndex].email?.icon || "",
                email: email?.email || footer.FooterRightContact[contactIndex].email?.email || "",
                emailId: email?.emailId || footer.FooterRightContact[contactIndex].email?.emailId || ""
            }
        };

        await footer.save();

        res.status(200).json({
            message: "Footer right contact updated successfully",
            data: footer.FooterRightContact[contactIndex]
        });

    } catch (error) {
        console.error("Error updating footer right contact:", error);
        res.status(500).json({
            message: "Error updating footer right contact",
            error: error.message
        });
    }
};

const deleteFooterRightContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { userId } = req.body;

        if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in request body"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Find the specific contact in FooterRightContact array
        const contactIndex = footer.FooterRightContact.findIndex(contact => contact._id.toString() === contactId);

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Footer right contact not found" });
        }

        // Remove the contact from array
        footer.FooterRightContact.splice(contactIndex, 1);
        await footer.save();

        res.status(200).json({
            message: "Footer right contact deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting footer right contact:", error);
        res.status(500).json({
            message: "Error deleting footer right contact",
            error: error.message
        });
    }
};

// Footer Help Center APIs
const createFooterHelpCenter = async (req, res) => {
    try {
        let userId = req.params.userId;

        // Handle different request formats from frontend
        if (!userId && req.body.userId) {
            userId = req.body.userId;
        }

        // If still no userId, try to get from localStorage equivalent
        if (!userId) {
            // Try to get from query params or headers
            userId = req.query.userId || req.headers['user-id'];
        }

        // If still no userId, try to get from localStorage (frontend equivalent)
        if (!userId) {
            // For the specific endpoint that frontend calls without userId
            // We'll try to find any existing document or create a new one
            let footer = await HeaderData.findOne({ FooterHelpCenter: { $exists: true, $ne: null } });

            if (!footer) {
                // Create a new document if none exists
                footer = new HeaderData();
                await footer.save();
            }

            userId = footer._id;
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in params, body, or headers"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Handle different request formats
        let newHelpCenter;

        if (req.body.sectionType === 'FooterHelpCenter' && req.body.data) {
            // Frontend is sending structured data
            const data = req.body.data;
            newHelpCenter = {
                leftSection: {
                    image: data.leftSection?.image || "",
                    title: data.leftSection?.title || "Have a Doubt We Can Help",
                    subtitle: data.leftSection?.subtitle || "Boot For Consultation",
                    icon: data.leftSection?.icon || "HeadphonesIcon",
                    show: data.leftSection?.show !== false
                },
                rightSection: {
                    image: data.rightSection?.image || "",
                    title: data.rightSection?.title || "Cloud Computing Service",
                    subtitle: data.rightSection?.subtitle || "Ckeck Eligibility",
                    icon: data.rightSection?.icon || "CloudIcon",
                    show: data.rightSection?.show !== false
                }
            };
        } else {
            // Handle file uploads for images
            let leftImagePath = "";
            let rightImagePath = "";

            if (req.files && req.files["leftSection[image]"]) {
                leftImagePath = req.files["leftSection[image]"][0].path;
            }
            if (req.files && req.files["rightSection[image]"]) {
                rightImagePath = req.files["rightSection[image]"][0].path;
            }

            // Create new footer help center data
            newHelpCenter = {
                leftSection: {
                    image: leftImagePath,
                    title: req.body["leftSection[title]"] || "Have a Doubt We Can Help",
                    subtitle: req.body["leftSection[subtitle]"] || "Boot For Consultation",
                    icon: req.body["leftSection[icon]"] || "HeadphonesIcon",
                    show: req.body["leftSection[show]"] === "true"
                },
                rightSection: {
                    image: rightImagePath,
                    title: req.body["rightSection[title]"] || "Cloud Computing Service",
                    subtitle: req.body["rightSection[subtitle]"] || "Ckeck Eligibility",
                    icon: req.body["rightSection[icon]"] || "CloudIcon",
                    show: req.body["rightSection[show]"] === "true"
                }
            };
        }

        // Update the document
        const updatedFooter = await HeaderData.findByIdAndUpdate(
            userId,
            { FooterHelpCenter: newHelpCenter },
            { new: true }
        );

        // Convert Windows path to URL-friendly path for response
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const responseData = {
            ...newHelpCenter,
            leftSection: {
                ...newHelpCenter.leftSection,
                image: fixPath(newHelpCenter.leftSection.image)
            },
            rightSection: {
                ...newHelpCenter.rightSection,
                image: fixPath(newHelpCenter.rightSection.image)
            }
        };

        res.status(201).json({
            message: "Footer help center created successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error creating footer help center:", error);
        res.status(500).json({
            message: "Error creating footer help center",
            error: error.message
        });
    }
};

const getFooterHelpCenter = async (req, res) => {
    try {
        let userId = req.params.userId;

        // Handle different request formats from frontend
        if (!userId && req.query.userId) {
            userId = req.query.userId;
        }

        // If still no userId, try to get from localStorage equivalent
        if (!userId) {
            // Try to get from query params or headers
            userId = req.query.userId || req.headers['user-id'];
        }

        // If still no userId, try to get from localStorage (frontend equivalent)
        if (!userId) {
            // For the specific endpoint that frontend calls without userId
            // We'll try to find any document with FooterHelpCenter data
            const footer = await HeaderData.findOne({ FooterHelpCenter: { $exists: true, $ne: null } }).select("FooterHelpCenter");

            if (!footer) {
                return res.status(404).json({ message: "No footer help center data found" });
            }

            // Convert Windows path to URL-friendly path
            const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

            const footerHelpCenter = footer.FooterHelpCenter ? {
                ...footer.FooterHelpCenter.toObject(),
                leftSection: {
                    ...footer.FooterHelpCenter.leftSection,
                    image: fixPath(footer.FooterHelpCenter.leftSection.image)
                },
                rightSection: {
                    ...footer.FooterHelpCenter.rightSection,
                    image: fixPath(footer.FooterHelpCenter.rightSection.image)
                }
            } : null;
            console.log("footerHelpCenter", footerHelpCenter);

            return res.status(200).json({
                success: true,
                data: footerHelpCenter
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in params, query, or headers"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterHelpCenter");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const footerHelpCenter = footer.FooterHelpCenter ? {
            ...footer.FooterHelpCenter.toObject(),
            leftSection: {
                ...footer.FooterHelpCenter.leftSection,
                image: fixPath(footer.FooterHelpCenter.leftSection.image)
            },
            rightSection: {
                ...footer.FooterHelpCenter.rightSection,
                image: fixPath(footer.FooterHelpCenter.rightSection.image)
            }
        } : null;

        res.status(200).json({
            success: true,
            data: footerHelpCenter
        });

    } catch (error) {
        console.error("Error getting footer help center:", error);
        res.status(500).json({
            message: "Error getting footer help center",
            error: error.message
        });
    }
};

const updateFooterHelpCenter = async (req, res) => {
    try {
        let userId = req.params.userId;
        const { helpCenterId } = req.params;

        // Handle different request formats from frontend
        if (!userId && req.body.userId) {
            userId = req.body.userId;
        }

        // If still no userId, try to get from localStorage equivalent
        if (!userId) {
            // Try to get from query params or headers
            userId = req.query.userId || req.headers['user-id'];
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in params, body, or headers"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Handle different request formats
        let updateData;

        if (req.body.sectionType === 'FooterHelpCenter' && req.body.data) {
            // Frontend is sending structured data
            const data = req.body.data;
            updateData = {
                leftSection: {
                    image: data.leftSection?.image || footer.FooterHelpCenter?.leftSection?.image || "",
                    title: data.leftSection?.title || footer.FooterHelpCenter?.leftSection?.title || "Have a Doubt We Can Help",
                    subtitle: data.leftSection?.subtitle || footer.FooterHelpCenter?.leftSection?.subtitle || "Boot For Consultation",
                    icon: data.leftSection?.icon || footer.FooterHelpCenter?.leftSection?.icon || "HeadphonesIcon",
                    show: data.leftSection?.show !== false
                },
                rightSection: {
                    image: data.rightSection?.image || footer.FooterHelpCenter?.rightSection?.image || "",
                    title: data.rightSection?.title || footer.FooterHelpCenter?.rightSection?.title || "Cloud Computing Service",
                    subtitle: data.rightSection?.subtitle || footer.FooterHelpCenter?.rightSection?.subtitle || "Ckeck Eligibility",
                    icon: data.rightSection?.icon || footer.FooterHelpCenter?.rightSection?.icon || "CloudIcon",
                    show: data.rightSection?.show !== false
                }
            };
        } else {
            // Handle file uploads for images
            let leftImagePath = footer.FooterHelpCenter?.leftSection?.image || "";
            let rightImagePath = footer.FooterHelpCenter?.rightSection?.image || "";

            if (req.files && req.files["leftSection[image]"]) {
                leftImagePath = req.files["leftSection[image]"][0].path;
            }
            if (req.files && req.files["rightSection[image]"]) {
                rightImagePath = req.files["rightSection[image]"][0].path;
            }

            // Update footer help center data
            updateData = {
                leftSection: {
                    image: leftImagePath,
                    title: req.body["leftSection[title]"] || footer.FooterHelpCenter?.leftSection?.title || "Have a Doubt We Can Help",
                    subtitle: req.body["leftSection[subtitle]"] || footer.FooterHelpCenter?.leftSection?.subtitle || "Boot For Consultation",
                    icon: req.body["leftSection[icon]"] || footer.FooterHelpCenter?.leftSection?.icon || "HeadphonesIcon",
                    show: req.body["leftSection[show]"] === "true"
                },
                rightSection: {
                    image: rightImagePath,
                    title: req.body["rightSection[title]"] || footer.FooterHelpCenter?.rightSection?.title || "Cloud Computing Service",
                    subtitle: req.body["rightSection[subtitle]"] || footer.FooterHelpCenter?.rightSection?.subtitle || "Ckeck Eligibility",
                    icon: req.body["rightSection[icon]"] || footer.FooterHelpCenter?.rightSection?.icon || "CloudIcon",
                    show: req.body["rightSection[show]"] === "true"
                }
            };
        }

        // Update the document
        const updatedFooter = await HeaderData.findByIdAndUpdate(
            userId,
            { FooterHelpCenter: updateData },
            { new: true }
        );

        // Convert Windows path to URL-friendly path for response
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const responseData = {
            ...updateData,
            leftSection: {
                ...updateData.leftSection,
                image: fixPath(updateData.leftSection.image)
            },
            rightSection: {
                ...updateData.rightSection,
                image: fixPath(updateData.rightSection.image)
            }
        };

        res.status(200).json({
            message: "Footer help center updated successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error updating footer help center:", error);
        res.status(500).json({
            message: "Error updating footer help center",
            error: error.message
        });
    }
};

// Footer Top Bar APIs
const createFooterTopBar = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in params"
            });
        }

        const footer = await HeaderData.findById(userId);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Handle file upload for image
        let imagePath = "";
        if (req.files && req.files["image"]) {
            imagePath = req.files["image"][0].path;
        }

        // Create new footer top bar
        const newTopBar = {
            image: imagePath,
            icon: req.body.icon || "",
            text: req.body.text || "",
            show: req.body.show === "true"
        };

        // Add to FooterTopBar array
        footer.FooterTopBar.push(newTopBar);
        await footer.save();

        // Convert Windows path to URL-friendly path for response
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const responseData = {
            ...newTopBar,
            image: fixPath(newTopBar.image)
        };

        res.status(201).json({
            message: "Footer top bar created successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error creating footer top bar:", error);
        res.status(500).json({
            message: "Error creating footer top bar",
            error: error.message
        });
    }
};

const getFooterTopBar = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID. Please provide userId in params"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterTopBar");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found for this user" });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const footerTopBar = footer.FooterTopBar.map(item => ({
            ...item.toObject(),
            image: fixPath(item.image)
        }));

        res.status(200).json({
            success: true,
            data: footerTopBar
        });

    } catch (error) {
        console.error("Error getting footer top bar:", error);
        res.status(500).json({
            message: "Error getting footer top bar",
            error: error.message
        });
    }
};

module.exports = {
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
};
