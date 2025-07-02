const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");



const getFunfactID = async (request, response) => {
    try {
        const { id } = request.params
        const getData = await HeaderData.findById(id).select('FunfactBox');
        return response.status(200).send({ success: true, data: getData.FunfactBox, })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }

}

const funfactUpdate = async (request, response) => {
    const { id } = request.params;
    const { projectCount, aboutProject } = request.body
    try {
        if (!id) {
            return response.status(400).send({ message: "User Not Found" })
        }
        const updatedDoc = await HeaderData.findByIdAndUpdate(
            id,
            { $push: { FunfactBox: { projectCount, aboutProject } } },
            { new: true }
        );

        response.json(updatedDoc);
    } catch (error) {
        console.log(error)
        return response.status(500).send({ message: "Somthing Went Wrong" })
    }
}


// DELETE 
const deleteFunfactItem = async (req, res) => {
    const { data, pageId } = req.body;

    if (!data || !pageId) {
        return res.status(400).json({ error: "Missing id or pageId" });
    }

    try {
        const result = await HeaderData.updateOne(
            { _id: pageId },
            { $pull: { FunfactBox: { _id: data } } }
        );

        res.status(200).json({ message: "Info item deleted", result });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// UPDATE REQ

const updateFunfactID = async (request, response) => {
    const { userId, userDocID } = request.params;
    const body = request.body;

    if (!userId || !userDocID) {
        return response.status(400).send({ message: "Missing ID or userDocID" });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const infoObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {
            
            "FunfactBox.$.projectCount": body.projectCount,
            "FunfactBox.$.aboutProject": body.aboutProject,

        };

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "FunfactBox._id": infoObjectId
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
    getFunfactID,
    funfactUpdate,
    deleteFunfactItem,
    updateFunfactID
}