const mongoose = require('mongoose');
const { HeaderData } = require('../modelSchema/headerSchema');
const { ObjectId } = mongoose.Types;

const postPrincingSection = async (request, response) => {
    const { id } = request.params;
    const body = request.body;
 
    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const { heading, listItem, price, item_ShowOnWebsite, button } = body;

        const newPrincingItem = {
            heading,
            price,
            button,
            listItem: typeof listItem === 'string' ? JSON.parse(listItem) : listItem || [],

        };

        const existing = await HeaderData.findOne({ _id: id });

        if (existing) {

          
            (existing.PrincingSection ??= []).push(newPrincingItem);
            await existing.save();

            return response.status(200).json({
                message: "New Princing item added successfully.",
                data: existing
            });
        } else {

            const newUser = new HeaderData({
                _id: id,
                PrincingSection: [newPrincingItem]
            });

            await newUser.save();

            return response.status(201).json({
                message: "New user document created with Princing item.",
                data: newUser
            });
        }

    } catch (error) {
        console.error("Error saving portfolio item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
};

const getPrincingData = async (request, response) => {
    const { id } = request.params

    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const findDocs = await HeaderData.findById(id).select("PrincingSection")
        if (!findDocs) {
            return response.status(400).json({ message: "Invalid or missing user Docs!" });
        }

        return response.status(200).send({ succes: true, data: findDocs.PrincingSection })

    } catch (error) {
        console.error("Error saving PrincingSection:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}


const deletePrincingData = async (request, response) => {
    const { data, pageId } = request.body

    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    PrincingSection: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Princing Itemes !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}

// updateDOCS
// const updatePrincingIDM = async (request, response) => {
//     const { userId, userDocID } = request.params;
//     const body = request.body;

//     if (!userId || !userDocID) {
//         return response.status(400).send({ message: "Missing ID or userDocID" });
//     }

//     try {
//         const userObjectId = new mongoose.Types.ObjectId(userId);
//         const princingObjectId = new mongoose.Types.ObjectId(userDocID);

//         const updateFields = {

//             "PrincingSection.$.heading": body.heading,
//             "PrincingSection.$.listItem": body.listItem,
//             "PrincingSection.$.price": body.price,
//             "PrincingSection.$.button": body.button

//         };

//         const updatedDoc = await HeaderData.findOneAndUpdate(
//             {
//                 _id: userObjectId,
//                 "PrincingSection._id": princingObjectId
//             },
//             {
//                 $set: updateFields
//             },
//             {
//                 new: true
//             }
//         );

//         if (!updatedDoc) {
//             return response.status(404).json({ error: "inFoData item not found" });
//         }

//         response.status(200).json({
//             message: "Princing  section updated successfully",
//             data: updatedDoc
//         });

//     } catch (error) {
//         console.error("Update error:", error);
//         response.status(500).json({ error: "Server error" });
//     }
// };
const updatePrincingIDM = async (req, res) => {
    const { userId, userDocID } = req.params;
    const body = req.body;

    if (!userId || !userDocID) {
        return res.status(400).json({ message: "Missing userId or userDocID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userDocID)) {
        return res.status(400).json({ message: "Invalid ObjectId(s)" });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const princingObjectId = new mongoose.Types.ObjectId(userDocID);

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "PrincingSection._id": princingObjectId
            },
            {
                $set: {
                    "PrincingSection.$.heading": body.heading,
                    "PrincingSection.$.listItem": body.listItem,
                    "PrincingSection.$.price": body.price,
                    "PrincingSection.$.button": body.button
                }
            },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Pricing section not found" });
        }

        return res.status(200).json({
            message: "Pricing section updated successfully",
            data: updatedDoc
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getDataPrincingForUpdate = async (request, response) => {
    const { userId, docsId } = request.params;

    if (!userId || !docsId) {
        return response.status(400).json({ message: "Both parentId and cardId are required" });
    }
    try {
        const document = await HeaderData.findById(userId).select("PrincingSection");

        if (!document) {
            return response.status(404).json({ message: "Parent document not found" });
        }
        const foundCard = document.PrincingSection.find(item => item._id.toString() === docsId);

        if (!foundCard) {
            return res.status(404).json({ message: "ServiceCard item not found" });
        }

        return response.status(200).json({ success: true, data: foundCard });
    } catch (error) {
        console.error("Fetch error:", error);
        return response.status(500).json({ error: "Server error" });
    }
}


module.exports = {

    postPrincingSection,
    getPrincingData,
    deletePrincingData,
    updatePrincingIDM,
    getDataPrincingForUpdate
    
};