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

            // existing.portfolioItems.push(newPortfolioItem);
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


module.exports = {
    updateAndCreateBlogStore,
    getBlogHeading,
    postBlogInformation,
    getBlogData
}
