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
        const body = req.body
        console.log("body____", body)

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
        // const updateData = {

        //     backgroundColor: req.body.backgroundColor || footer.FooterBackground?.backgroundColor || "",
        //     backgroundImage: backgroundImagePath || footer.FooterBackground?.backgroundImage || ""
        // };
        const updateData = {
            backgroundColor:
                "backgroundColor" in req.body
                    ? req.body.backgroundColor
                    : footer.FooterBackground?.backgroundColor || "",

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














// Get Footer Help Center Form Data by User ID
const getFooterHelpCenterForm = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required in params"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterHelpCenter");

        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer data not found for this user"
            });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        const footerHelpCenter = footer.FooterHelpCenter ? {
            _id: footer._id,
            ...footer.FooterHelpCenter.toObject(),
            leftSection: {
                ...footer.FooterHelpCenter.leftSection,
                image: fixPath(footer.FooterHelpCenter.leftSection?.image)
            },
            rightSection: {
                ...footer.FooterHelpCenter.rightSection,
                image: fixPath(footer.FooterHelpCenter.rightSection?.image)
            }
        } : null;

        res.status(200).json({
            success: true,
            data: footerHelpCenter
        });

    } catch (error) {
        console.error("Error getting footer help center form:", error);
        res.status(500).json({
            success: false,
            message: "Error getting footer help center form",
            error: error.message
        });
    }
};








const getAllFooterData = async (req, res) => {
    const { userId } = req.params;
    try {
        const footer = await HeaderData.findById(userId).select("FooterHelpCenter FooterContact FooterRightContact FooterSponese FooterBackground FooterCategory FooterTags FooterTopBar");
        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer data not found for this user"
            });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (path) => path ? `/${path.replace(/\\/g, '/')}` : "";

        // Process FooterContact logo
        const processedFooterContact = footer.FooterContact?.length > 0 ? {
            ...footer.FooterContact[0].toObject(),
            logo: fixPath(footer.FooterContact[0].logo)
        } : null;

        // Process FooterBackground image
        const processedFooterBackground = footer.FooterBackground ? {
            ...footer.FooterBackground,
            backgroundImage: fixPath(footer.FooterBackground.backgroundImage)
        } : null;

        // Process FooterSponsors images
        const processedFooterSponsors = footer.FooterSponese?.length > 0 ? {
            sponsorsOne: fixPath(footer.FooterSponese[0].sponsorsOne),
            sponsorsTwo: fixPath(footer.FooterSponese[0].sponsorsTwo),
            sponsorsThree: fixPath(footer.FooterSponese[0].sponsorsThree),
            sponsorsFour: fixPath(footer.FooterSponese[0].sponsorsFour),
            sponsorsFive: fixPath(footer.FooterSponese[0].sponsorsFive)
        } : null;

        res.status(200).json({
            success: true,
            FooterContact: processedFooterContact,
            FooterRightContact: footer.FooterRightContact?.length > 0 ? footer.FooterRightContact[0] : null,
            FooterSponsors: processedFooterSponsors,
            FooterBackground: processedFooterBackground,
            FooterCategories: footer.FooterCategory || [],
            FooterTags: footer.FooterTags || [],
            FooterTopBar: footer.FooterTopBar ? {
                ...footer.FooterTopBar.toObject(),
                leftSection: {
                    ...footer.FooterTopBar.leftSection,
                    image: fixPath(footer.FooterTopBar.leftSection?.image)
                },
                rightSection: {
                    ...footer.FooterTopBar.rightSection,
                    image: fixPath(footer.FooterTopBar.rightSection?.image)
                }
            } : null
        });
    } catch (error) {
        console.error("Error getting all footer data:", error);
        res.status(500).json({
            success: false,
            message: "Error getting all footer data",
            error: error.message
        });
    }
}

// Footer Sponsors Management APIs
const getFooterSponsors = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id).select("FooterSponese");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const sponsorsData = footer.FooterSponese.length > 0 ? {
            Image_one: fixPath(footer.FooterSponese[0].sponsorsOne),
            Image_two: fixPath(footer.FooterSponese[0].sponsorsTwo),
            Image_three: fixPath(footer.FooterSponese[0].sponsorsThree),
            Image_four: fixPath(footer.FooterSponese[0].sponsorsFour),
            Image_five: fixPath(footer.FooterSponese[0].sponsorsFive)
        } : {
            Image_one: "",
            Image_two: "",
            Image_three: "",
            Image_four: "",
            Image_five: ""
        };

        res.status(200).json({
            success: true,
            data: sponsorsData
        });

    } catch (error) {
        console.error("Error getting footer sponsors:", error);
        res.status(500).json({
            message: "Error getting footer sponsors",
            error: error.message
        });
    }
};

const updateFooterSponsors = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Handle file uploads for sponsor images
        const filePaths = {
            sponsorsOne: req.files["Image_one"]?.[0]?.path || "",
            sponsorsTwo: req.files["Image_two"]?.[0]?.path || "",
            sponsorsThree: req.files["Image_three"]?.[0]?.path || "",
            sponsorsFour: req.files["Image_four"]?.[0]?.path || "",
            sponsorsFive: req.files["Image_five"]?.[0]?.path || "",
        };

        // Create new sponsor data
        const newSponsorData = {
            sponsorsOne: filePaths.sponsorsOne,
            sponsorsTwo: filePaths.sponsorsTwo,
            sponsorsThree: filePaths.sponsorsThree,
            sponsorsFour: filePaths.sponsorsFour,
            sponsorsFive: filePaths.sponsorsFive,
            showOnWebsite: true,
            userId: id
        };

        // Update or create sponsor data
        if (footer.FooterSponese.length > 0) {
            // Update existing sponsor data, preserving non-empty fields
            const existingSponsor = footer.FooterSponese[0];
            footer.FooterSponese[0] = {
                ...existingSponsor,
                sponsorsOne: filePaths.sponsorsOne || existingSponsor.sponsorsOne,
                sponsorsTwo: filePaths.sponsorsTwo || existingSponsor.sponsorsTwo,
                sponsorsThree: filePaths.sponsorsThree || existingSponsor.sponsorsThree,
                sponsorsFour: filePaths.sponsorsFour || existingSponsor.sponsorsFour,
                sponsorsFive: filePaths.sponsorsFive || existingSponsor.sponsorsFive,
            };
        } else {
            // Create new sponsor data
            footer.FooterSponese.push(newSponsorData);
        }

        await footer.save();

        // Convert Windows path to URL-friendly path for response
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const responseData = {
            Image_one: fixPath(footer.FooterSponese[0].sponsorsOne),
            Image_two: fixPath(footer.FooterSponese[0].sponsorsTwo),
            Image_three: fixPath(footer.FooterSponese[0].sponsorsThree),
            Image_four: fixPath(footer.FooterSponese[0].sponsorsFour),
            Image_five: fixPath(footer.FooterSponese[0].sponsorsFive)
        };

        res.status(200).json({
            message: "Footer sponsors updated successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error updating footer sponsors:", error);
        res.status(500).json({
            message: "Error updating footer sponsors",
            error: error.message
        });
    }
};

const createFooterSponsors = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Handle file uploads for sponsor images
        const filePaths = {
            sponsorsOne: req.files["Image_one"]?.[0]?.path || "",
            sponsorsTwo: req.files["Image_two"]?.[0]?.path || "",
            sponsorsThree: req.files["Image_three"]?.[0]?.path || "",
            sponsorsFour: req.files["Image_four"]?.[0]?.path || "",
            sponsorsFive: req.files["Image_five"]?.[0]?.path || "",
        };

        // Create new sponsor data
        const newSponsorData = {
            sponsorsOne: filePaths.sponsorsOne,
            sponsorsTwo: filePaths.sponsorsTwo,
            sponsorsThree: filePaths.sponsorsThree,
            sponsorsFour: filePaths.sponsorsFour,
            sponsorsFive: filePaths.sponsorsFive,
            showOnWebsite: true,
            userId: id
        };

        // Add to FooterSponese array
        footer.FooterSponese.push(newSponsorData);
        await footer.save();

        // Convert Windows path to URL-friendly path for response
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const responseData = {
            Image_one: fixPath(newSponsorData.sponsorsOne),
            Image_two: fixPath(newSponsorData.sponsorsTwo),
            Image_three: fixPath(newSponsorData.sponsorsThree),
            Image_four: fixPath(newSponsorData.sponsorsFour),
            Image_five: fixPath(newSponsorData.sponsorsFive)
        };

        res.status(201).json({
            message: "Footer sponsors created successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error creating footer sponsors:", error);
        res.status(500).json({
            message: "Error creating footer sponsors",
            error: error.message
        });
    }
};

// Footer Top Bar APIs
const createFooterTopBar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id);

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Handle file uploads for top bar images
        const leftImagePath = req.files["leftImage"]?.[0]?.path || "";
        const rightImagePath = req.files["rightImage"]?.[0]?.path || "";

        // Create footer top bar data
        const footerTopBarData = {
            leftSection: {
                title: req.body.leftTitle || "",
                subTitle: req.body.leftSubTitle || "",
                icone: req.body.leftIcone || "",
                image: leftImagePath
            },
            rightSection: {
                title: req.body.rightTitle || "",
                subTitle: req.body.rightSubTitle || "",
                icone: req.body.rightIcone || "",
                image: rightImagePath
            }
        };

        // Update or create footer top bar
        footer.FooterTopBar = footerTopBarData;
        await footer.save();

        // Convert Windows path to URL-friendly path for response
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const responseData = {
            leftSection: {
                ...footerTopBarData.leftSection,
                image: fixPath(footerTopBarData.leftSection.image)
            },
            rightSection: {
                ...footerTopBarData.rightSection,
                image: fixPath(footerTopBarData.rightSection.image)
            }
        };

        res.status(200).json({
            message: "Footer top bar updated successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error updating footer top bar:", error);
        res.status(500).json({
            message: "Error updating footer top bar",
            error: error.message
        });
    }
};

const getFooterTopBar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const footer = await HeaderData.findById(id).select("FooterTopBar");

        if (!footer) {
            return res.status(404).json({ message: "Footer data not found" });
        }

        // Convert Windows path to URL-friendly path
        const fixPath = (p) => p ? `/${p.replace(/\\/g, '/')}` : "";

        const footerTopBar = footer.FooterTopBar ? {
            leftSection: {
                title: footer.FooterTopBar.leftSection?.title || "",
                subTitle: footer.FooterTopBar.leftSection?.subTitle || "",
                icone: footer.FooterTopBar.leftSection?.icone || "",
                image: fixPath(footer.FooterTopBar.leftSection?.image)
            },
            rightSection: {
                title: footer.FooterTopBar.rightSection?.title || "",
                subTitle: footer.FooterTopBar.rightSection?.subTitle || "",
                icone: footer.FooterTopBar.rightSection?.icone || "",
                image: fixPath(footer.FooterTopBar.rightSection?.image)
            }
        } : {
            leftSection: {
                title: "",
                subTitle: "",
                icone: "",
                image: ""
            },
            rightSection: {
                title: "",
                subTitle: "",
                icone: "",
                image: ""
            }
        };

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


// Footer Copyright APIs
const getFooterCopyRight = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        const footer = await HeaderData.findById(userId).select("FooterCopyRight");

        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer data not found for this user"
            });
        }

        // Return the first copyright entry or create default structure
        const copyrightData = footer.FooterCopyRight && footer.FooterCopyRight.length > 0
            ? footer.FooterCopyRight[0]
            : {
                section: 'copyright',
                copyrightText: 'Copyright © 2023 Corpex | Powered By Corpex',
                poweredByText: 'Corpex',
                paymentIcons: [
                    { id: 1, name: 'Payment 1', icon: '', url: '', isActive: true }
                ]
            };

        res.status(200).json({
            success: true,
            data: [copyrightData] // Return as array to match frontend expectation
        });

    } catch (error) {
        console.error("Error getting footer copyright:", error);
        res.status(500).json({
            success: false,
            message: "Error getting footer copyright",
            error: error.message
        });
    }
};

const createUpdateFooterCopyRight = async (req, res) => {
    try {
        const { userId } = req.params;
        const { section, copyrightText, poweredByText, paymentIcons } = req.body;

        console.log("Received request:", { userId, section, copyrightText, poweredByText, paymentIcons });

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        if (!copyrightText || !poweredByText) {
            return res.status(400).json({
                success: false,
                message: "Copyright text and powered by text are required"
            });
        }

        // Use findOneAndUpdate for better atomicity
        const copyrightData = {
            section: section || 'copyright',
            copyrightText,
            poweredByText,
            paymentIcons: Array.isArray(paymentIcons) ? paymentIcons : []
        };

        // Try to update existing copyright first
        let footer = await HeaderData.findOneAndUpdate(
            {
                _id: userId,
                "FooterCopyRight.section": "copyright"
            },
            {
                $set: {
                    "FooterCopyRight.$.section": copyrightData.section,
                    "FooterCopyRight.$.copyrightText": copyrightData.copyrightText,
                    "FooterCopyRight.$.poweredByText": copyrightData.poweredByText,
                    "FooterCopyRight.$.paymentIcons": copyrightData.paymentIcons
                }
            },
            { new: true }
        );

        if (footer) {
            console.log("Updated existing copyright");
        } else {
            // If no existing copyright found, create new one
            footer = await HeaderData.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        FooterCopyRight: {
                            _id: new mongoose.Types.ObjectId(),
                            ...copyrightData
                        }
                    }
                },
                { new: true, upsert: true }
            );
            console.log("Created new copyright");
        }

        const updatedCopyright = footer.FooterCopyRight.find(item => item.section === 'copyright');

        res.status(200).json({
            success: true,
            message: existingIndex !== -1
                ? "Footer copyright updated successfully"
                : "Footer copyright created successfully",
            data: updatedCopyright
        });

    } catch (error) {
        console.error("Error creating/updating footer copyright:", error);
        res.status(500).json({
            success: false,
            message: "Error creating/updating footer copyright",
            error: error.message
        });
    }
};

// Delete individual payment icon by ID
const deleteIconById = async (req, res) => {
    try {
        const { userId, iconId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        if (!iconId) {
            return res.status(400).json({
                success: false,
                message: "Icon ID is required"
            });
        }

        const footer = await HeaderData.findOneAndUpdate(
            {
                _id: userId,
                "FooterCopyRight.section": "copyright"
            },
            {
                $pull: {
                    "FooterCopyRight.$.paymentIcons": { id: parseInt(iconId) }
                }
            },
            { new: true }
        );

        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer copyright section not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Icon ${iconId} deleted successfully`
        });

    } catch (error) {
        console.error("Error deleting icon:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting icon",
            error: error.message
        });
    }
};

// Delete multiple payment icons
const deleteMultipleIcons = async (req, res) => {
    try {
        const { userId, footerId } = req.params;
        const { iconIds } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        if (!iconIds || !Array.isArray(iconIds)) {
            return res.status(400).json({
                success: false,
                message: "Icon IDs array is required"
            });
        }

        const footer = await HeaderData.findOneAndUpdate(
            {
                _id: userId,
                "FooterCopyRight.section": "copyright"
            },
            {
                $pull: {
                    "FooterCopyRight.$.paymentIcons": {
                        id: { $in: iconIds.map(id => parseInt(id)) }
                    }
                }
            },
            { new: true }
        );

        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer copyright section not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `${iconIds.length} payment icon(s) deleted successfully`
        });

    } catch (error) {
        console.error("Error deleting multiple icons:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting multiple icons",
            error: error.message
        });
    }
};

// Delete entire footer copyright section
const deleteEntireFooter = async (req, res) => {
    try {
        const { userId, footerId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        if (!footerId || !mongoose.Types.ObjectId.isValid(footerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Footer ID"
            });
        }

        const footer = await HeaderData.findOneAndUpdate(
            {
                _id: userId,
                "FooterCopyRight._id": footerId
            },
            {
                $pull: {
                    FooterCopyRight: { _id: footerId }
                }
            },
            { new: true }
        );

        if (!footer) {
            return res.status(404).json({
                success: false,
                message: "Footer copyright section not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Footer copyright section deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting footer copyright section:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting footer copyright section",
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
};
