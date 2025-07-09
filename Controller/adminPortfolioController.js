const mongoose = require('mongoose');
const { HeaderData } = require('../modelSchema/headerSchema');
const { ObjectId } = mongoose.Types;

const postPortfolioSection = async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    console.log(body)

    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const { title, subTitle, categories, item_ShowOnWebsite, Icone } = body;

        const newPortfolioItem = {
            title,
            subTitle,
            item_ShowOnWebsite,
            Icone,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories || [],
            userImage: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""

        };

        const existing = await HeaderData.findOne({ _id: id });

        if (existing) {

            // existing.portfolioItems.push(newPortfolioItem);
            (existing.portfolioItems ??= []).push(newPortfolioItem);
            await existing.save();

            return response.status(200).json({
                message: "New portfolio item added successfully.",
                data: existing
            });
        } else {

            const newUser = new HeaderData({
                _id: id,
                portfolioItems: [newPortfolioItem]
            });

            await newUser.save();

            return response.status(201).json({
                message: "New user document created with portfolio item.",
                data: newUser
            });
        }

    } catch (error) {
        console.error("Error saving portfolio item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
};

const getPortfolioPost = async (request, response) => {
    const { id } = request.params

    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const findDocs = await HeaderData.findById(id).select("portfolioItems")
        if (!findDocs) {
            return response.status(400).json({ message: "Invalid or missing user Docs!" });
        }

        return response.status(200).send({ succes: true, data: findDocs.portfolioItems })

    } catch (error) {
        console.error("Error saving portfolio item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}


const deletePortData = async (request, response) => {
    const { data, pageId } = request.body


    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    portfolioItems: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Successfully Portfolio Categories !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}

// updateDOCS
const updatePortfoliorData = async (req, res) => {
    const { userId, userDocID } = req.params;

    if (!userId || !userDocID) {
        return res.status(400).send({ message: "Id Not found" })
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const userDocsObjectId = new mongoose.Types.ObjectId(userDocID);
       
        const updateFields = {
            "portfolioItems.$.title": req.body.title || "",
            "portfolioItems.$.subTitle": req.body.subTitle || "",
            "portfolioItems.$.item_ShowOnWebsite": req.body.item_ShowOnWebsite || "",
            // "portfolioItems.$.categories": req.body.categories || "",
            "portfolioItems.$.categories": req.body.categories
                ? JSON.parse(req.body.categories)
                : [],
            "portfolioItems.$.Icone": req.body.Icone || ""
        };

        if (req.file) {
            updateFields["portfolioItems.$.userImage"] =
                `/uploadsStore/${req.params.userId}/${req.file.filename}`;

        }

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "portfolioItems._id": userDocsObjectId
            },
            {
                $set: updateFields
            },
            {
                new: true
            }
        );

        if (!updatedDoc) {
            return res.status(404).json({ error: "Hero section item not found" });
        }

        res.status(200).json({
            message: "Portfolio section updated successfully",
            data: updatedDoc
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};


module.exports = {
    postPortfolioSection,
    getPortfolioPost,
    deletePortData,
    updatePortfoliorData
};