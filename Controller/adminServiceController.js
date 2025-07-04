const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");





const ServiceCardUpdate = async (request, response) => {    
    try {
        const { id } = request.params
        const { iconeTop, serviceHeading, ServiceDescription, iconeBottom } = request.body;

        if (!id) {
            return response.status(400).send({ message: "User Not Found" })
        }


        const updatedDoc = await HeaderData.findByIdAndUpdate(
            id,
            { $push: { ServiceCard: { iconeTop, serviceHeading, ServiceDescription, iconeBottom } } },
            { new: true }
        );

        response.json(updatedDoc);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
}


const getSeriveCardDataID = async (request, response) => {
    try {
        const { id } = request.params
        const getData = await HeaderData.findById(id).select('ServiceCard');
        return response.status(200).send({ success: true, data: getData.ServiceCard, })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }

}

const deleteServiceItem = async (req, res) => {
    const { data, pageId } = req.body;

    if (!data || !pageId) {
        return res.status(400).json({ error: "Missing id or pageId" });
    }

    try {
        const result = await HeaderData.updateOne(
            { _id: pageId },
            { $pull: { ServiceCard: { _id: data } } }
        );

        res.status(200).json({ message: "Info item deleted", result });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
const getServiceCardByID = async (req, res) => {
    const { parentId, cardId } = req.params;

    if (!parentId || !cardId) {
        return res.status(400).json({ message: "Both parentId and cardId are required" });
    }
    try {
        const document = await HeaderData.findById(parentId).select("ServiceCard");

        if (!document) {
            return res.status(404).json({ message: "Parent document not found" });
        }
        const foundCard = document.ServiceCard.find(item => item._id.toString() === cardId);

        if (!foundCard) {
            return res.status(404).json({ message: "ServiceCard item not found" });
        }

        return res.status(200).json({ success: true, data: foundCard });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// update main 
const updateServiceIDM = async (request, response) => {
    const { userId, userDocID } = request.params;
    const body = request.body;

    if (!userId || !userDocID) {
        return response.status(400).send({ message: "Missing ID or userDocID" });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const infoObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {

            "ServiceCard.$.iconeTop": body.iconeTop,
            "ServiceCard.$.serviceHeading": body.serviceHeading,
            "ServiceCard.$.ServiceDescription": body.ServiceDescription,
            "ServiceCard.$.iconeBottom": body.iconeBottom
            
        };

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "ServiceCard._id": infoObjectId
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
    ServiceCardUpdate,
    getSeriveCardDataID,
    deleteServiceItem,
    getServiceCardByID,
    updateServiceIDM
}