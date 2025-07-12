const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");
const { request, response } = require("express");
const { ObjectId } = mongoose.Types;




const updateAndCreateBlogStore = async (request, response) => {
    const id = request.params.id;
    const sectionId = request.params.sectionId;

    const { blogHeading, blogDescription } = request.body;


    if (!blogHeading || !blogDescription) {
        return response.status(400).json({ message: "All fields are required" });
    }

    try {

        let userData = await HeaderData.findById(id);

        if (!userData) {

            userData = new HeaderData({
                _id: id,
                BlogHeadingSection: [],
            });
        }

        let message;

        if (sectionId) {

            const section = userData.BlogHeadingSection.id(sectionId);

            if (!section) {
                return response.status(404).json({ message: "Section not found" });
            }

            section.blogHeading = blogHeading;
            section.blogDescription = blogDescription;
            message = "Blog section Update successfully.";


        } else {

            userData.BlogHeadingSection.push({
                _id: new mongoose.Types.ObjectId(),
                blogHeading
                ,
                blogDescription

            });

            message = "Blog section created successfully.";
        }

        await userData.save();

        return response.status(200).json({
            message,

        });

    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


const getBlogHeading = async (request, response) => {
    const { id } = request.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).send({ message: "User ID Not Found !" })
    }

    try {
        const findDocs = await HeaderData.findById(id).select("BlogHeadingSection")
        if (!findDocs) {
            return response.status(400).send({ message: "Docs is Not found  !" })
        }
        return response.status(200).send({ success: true, data: findDocs.BlogHeadingSection })


    } catch (error) {
        console.log(error)
        return response.status(500).send({ message: "Internal Error" })
    }
}


const postBlogInformation = async (request, response) => {
    const { id } = request.params;
    const { goIcone, blogDatePicker, blogerRoleIocne, blogerRole, blogHeading, blogDescription, blogButton } = request.body;


    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const newTeam = {
            goIcone,
            blogDatePicker,
            blogerRoleIocne,
            blogerRole,
            blogHeading,
            blogDescription,
            blogButton,
            blogerImage: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""
        }

        const exsist = await HeaderData.findById({ _id: id })

        if (exsist) {

            // existing.BlogCardSection.push(newPortfolioItem);
            (exsist.BlogCardSection ??= []).push(newTeam);
            await exsist.save();

            return response.status(200).json({
                message: "New Blog added successfully.",
                data: exsist
            });
        } else {

            const newUser = new HeaderData({
                _id: id,
                BlogCardSection: [newTeam]
            });

            await newUser.save();

            return response.status(201).json({
                message: "New user document created with BlogCardSection item.",
                data: newUser
            });
        }

    } catch (error) {
        console.error("Error saving team item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}

const getBlogData = async (request, response) => {
    const { id } = request.params
    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const findDocs = await HeaderData.findById(id).select("BlogCardSection")
        if (!findDocs) {
            return response.status(400).json({ message: "Invalid or missing user Docs!" });
        }

        return response.status(200).send({ succes: true, data: findDocs.BlogCardSection })

    } catch (error) {
        console.error("Error saving BlogCardSection item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}

const deleteBlogData = async (request, response) => {
    const { data, pageId } = request.body

    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    BlogCardSection: { _id: new ObjectId(data) }
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Successfully Blog Card Section !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}

const getBlogDataForUpdate = async (request, response) => {
    const { id, docsId } = request.params;

    if (!id || !docsId) {
        return response.status(400).json({ message: "Both parentId and cardId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(docsId)) {
        return response.status(400).json({ message: "Invalid or missing user ID!" });
    }
    try {
        const document = await HeaderData.findById(id).select("BlogCardSection");
        if (!document) {
            return response.status(404).json({ message: "Parent document not found" });
        }
        const foundCard = document.BlogCardSection.find(item => item._id.toString() === docsId);

        if (!foundCard) {
            return res.status(404).json({ message: "BlogCardSection item not found" });
        }
        return response.status(200).json({ success: true, data: foundCard });
    } catch (error) {
        console.error("Fetch error:", error);
        return response.status(500).json({ error: "Server error" });
    }
}

const updateBlogData = async (req, res) => {
    const { id, userDocID } = req.params;

    if (!id || !userDocID) {
        return res.status(400).send({ message: "Id Not found" })
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(id);
        const userDocsObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {

            "BlogCardSection.$.goIcone": req.body.goIcone || "",
            "BlogCardSection.$.blogDatePicker": req.body.blogDatePicker || "",
            "BlogCardSection.$.blogerRoleIocne": req.body.blogerRoleIocne || "",
            "BlogCardSection.$.blogerRole": req.body.blogerRole || "",
            "BlogCardSection.$.blogHeading": req.body.blogHeading || "",
            "BlogCardSection.$.blogDescription": req.body.blogDescription || "",
            "BlogCardSection.$.blogButton": req.body.blogButton || "",

        };

        if (req.file) {
            updateFields["BlogCardSection.$.blogerImage"] =
                `/uploadsStore/${req.params.id}/${req.file.filename}`;

        }

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "BlogCardSection._id": userDocsObjectId
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
            message: "Blog  updated successfully",
            data: updatedDoc
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};


module.exports = {

    updateAndCreateBlogStore,
    getBlogHeading,
    postBlogInformation,
    getBlogData,
    deleteBlogData,
    getBlogDataForUpdate,
    updateBlogData

}
