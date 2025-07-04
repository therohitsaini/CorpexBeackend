const mongoose = require('mongoose');
const { HeaderData } = require('../modelSchema/headerSchema');
const { response } = require('express');


const postTestimonialSection = async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    console.log(body)

    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const { heading, userName, paragraph, occupationRole } = body;

        const newTestimonialSection = {

            heading,
            userName,
            paragraph,
            occupationRole,
            userProfile: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""

        };

        const existing = await HeaderData.findOne({ _id: id });

        if (existing) {

            (existing.TestimonialSection ??= []).push(newTestimonialSection);
            await existing.save();

            return response.status(200).json({
                message: "New portfolio item added successfully.",
                data: existing
            });
        } else {

            const newUser = new HeaderData({
                _id: id,
                TestimonialSection: [newTestimonialSection]
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


const getTestimonial = (request, response) => {
    const { id } = request.params

    try {

    } catch (error) {
        console.log(error)
        return response.status(500).json({ error: "Internal server error." });
    }
}


module.exports = {
    postTestimonialSection
}