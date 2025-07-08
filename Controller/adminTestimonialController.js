const mongoose = require('mongoose');
const { HeaderData } = require('../modelSchema/headerSchema');

const { ObjectId } = mongoose.Types;


const postTestimonialSection = async (request, response) => {
    const { id } = request.params;
    const body = request.body;
  
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
                message: "New Testimonial item added successfully.",
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


const getTestimonial = async (request, response) => {
    const { id } = request.params
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const findDocs = await HeaderData.findById(id).select("TestimonialSection")
        if (!findDocs) {
            return response.status(400).json({ message: "Invalid or missing user Docs!" });
        }
        return response.status(200).send({ succes: true, data: findDocs.TestimonialSection })


    } catch (error) {
        console.log(error)
        return response.status(500).json({ error: "Internal server error." });
    }
}


// get data by docs id and user id 
const getDataPrincingForUpdate = async (request, response) => {
    const { userId, docsId } = request.params;

    if (!userId || !docsId) {
        return response.status(400).json({ message: "Both parentId and cardId are required" });
    }
    try {
        const document = await HeaderData.findById(userId).select("TestimonialSection");

        if (!document) {
            return response.status(404).json({ message: "Parent document not found" });
        }
        const foundCard = document.TestimonialSection.find(item => item._id.toString() === docsId);

        if (!foundCard) {
            return res.status(404).json({ message: "TestimonialSection item not found" });
        }

        return response.status(200).json({ success: true, data: foundCard });
    } catch (error) {
        console.error("Fetch error:", error);
        return response.status(500).json({ error: "Server error" });
    }
}

// updateDOCS
const updateTestimonilaData = async (req, res) => {
    const { id, userDocID } = req.params;


    if (!id || !userDocID) {
        return res.status(400).send({ message: "Id Not found" })
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(id);
        const testiObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {
            "TestimonialSection.$.heading": req.body.heading || "",
            "TestimonialSection.$.userName": req.body.userName || "",
            "TestimonialSection.$.paragraph": req.body.paragraph || "",
            "TestimonialSection.$.occupationRole": req.body.occupationRole || "",

        };

        if (req.file) {
            updateFields["TestimonialSection.$.userProfile"] = `/uploads/${req.file.filename}`;
        }

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "TestimonialSection._id": testiObjectId
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
            message: "Testimonial Section Updated Successfully",
            data: updatedDoc
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};


const getDataTestimonialForUpdate = async (request, response) => {

    const { id, docsId } = request.params;

    if (!id || !docsId) {
        return response.status(400).json({ message: "Both parentId and cardId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(docsId)) {
        return response.status(400).json({ message: "Invalid or missing user ID!" });
    }
    try {
        const document = await HeaderData.findById(id).select("TestimonialSection");
        if (!document) {
            return response.status(404).json({ message: "Parent document not found" });
        }
        const foundCard = document.TestimonialSection.find(item => item._id.toString() === docsId);

        if (!foundCard) {
            return res.status(404).json({ message: "Testimonial item not found" });
        }
        return response.status(200).json({ success: true, data: foundCard });
    } catch (error) {
        console.error("Fetch error:", error);
        return response.status(500).json({ error: "Server error" });
    }
}

const deleteTestimonialData = async (request, response) => {
    const { data, pageId } = request.body

    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    TestimonialSection: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Testimonial Itemes !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}


module.exports = {

    postTestimonialSection,
    getTestimonial,
    updateTestimonilaData,
    getDataTestimonialForUpdate,
    deleteTestimonialData

}