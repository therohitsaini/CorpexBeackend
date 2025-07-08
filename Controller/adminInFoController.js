const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");


// POST REQ
const UpdateInFo = async (request, response) => {
    try {
        const { id } = request.params

        const { inFoHeading, inFoDescription, inFoIcone, } = request.body;

        if (!id) {
            return response.status(400).send({ message: "User Not Found" })
        }
        const updatedDoc = await HeaderData.findByIdAndUpdate(
            id,
            { $push: { inFoData: { inFoHeading, inFoDescription, inFoIcone } } },
            { new: true }
        );

        // response.json(updatedDoc);
        return response.status(201).send({ message: "New Info Item Add !" })
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const getInFo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing document ID" });
        }
        const document = await HeaderData.findById(id).select('inFoData');;

        if (!document || !document.inFoData || document.inFoData.length === 0) {
            return res.status(404).json({ message: "Hero section not found" });
        }
        const inFoDataBack = document.inFoData;

        res.status(200).json({
            message: "Hero section fetched successfully",
            data: inFoDataBack
        });

    } catch (err) {
        console.error("Error fetching hero section:", err);
        res.status(500).json({ error: err.message });
    }
}

const deleteInFoItem = async (req, res) => {
    const { data, pageId } = req.body;

    if (!data || !pageId) {
        return res.status(400).json({ error: "Missing id or pageId" });
    }

    try {
        const result = await HeaderData.updateOne(
            { _id: pageId },
            { $pull: { inFoData: { _id: data } } }
        );

        res.status(200).json({ message: "Info item deleted", result });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const updateInFoID = async (request, response) => {
    const { userId, userDocID } = request.params;
    const body = request.body

    if (!userId || !userDocID) {
        return response.status(400).send({ message: "Missing ID or userDocID" });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const infoObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {
            "inFoData.$.inFoHeading": body.inFoHeading,
            "inFoData.$.inFoDescription": body.inFoDescription,
            "inFoData.$.inFoIcone": body.inFoIcone
        };

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "inFoData._id": infoObjectId
            },
            {
                $set: updateFields
            },
            {
                new: true
            }
        );

        if (!updatedDoc) {
            return response.status(404).json({ error: "inFoData item not found" });
        }

        response.status(200).json({
            message: "Info section updated successfully",
            data: updatedDoc
        });

    } catch (error) {
        console.error("Update error:", error);
        response.status(500).json({ error: "Server error" });
    }
};



module.exports = {
    UpdateInFo,
    getInFo,
    deleteInFoItem,
    updateInFoID
}