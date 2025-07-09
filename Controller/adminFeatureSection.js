const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");
const { ObjectId } = mongoose.Types;


// const updateAndCreateFeatureSectionStore = async (req, res) => {


//     const { id } = req.params;

//     const sectionlistTitle = req.body.sectionlistTitle;
//     const setionDescriptions = req.body.setionDescriptions;
//     const setionImage = req.file ? `/uploadsStore/${id}/${req.file.filename}` : ""

//     if (!sectionlistTitle || !setionDescriptions) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         const userData = await HeaderData.findById(id);

//         if (!userData) {
//             return res.status(404).json({ message: "User not found with given ID." });
//         }


//         const existingIndex = userData.FeatureSectionStore.findIndex(
//             (item) => item.sectionlistTitle === sectionlistTitle
//         );

//         if (existingIndex !== -1) {
//             userData.FeatureSectionStore[existingIndex].setionDescriptions = setionDescriptions;
//             if (setionImage) {
//                 userData.FeatureSectionStore[existingIndex].setionImage = setionImage;
//             }
//         } else {
//             userData.FeatureSectionStore.push({
//                 sectionlistTitle,
//                 setionDescriptions,
//                 setionImage,
//             });
//         }

//         await userData.save();

//         return res.status(200).json({
//             message: existingIndex !== -1
//                 ? "Feature section updated successfully."
//                 : "Feature section created successfully.",
//             data: userData.FeatureSectionStore,
//         });

//     } catch (error) {
//         console.error("Error in FeatureSectionStore:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };




const updateAndCreateFeatureSectionStore = async (req, res) => {
    const id = req.params.id;       // ID of HeaderData document (user)
    const sectionId = req.params.sectionId; // ID of section to update (optional)

    const { sectionlistTitle, setionDescriptions } = req.body;
    const setionImage = req.file ? `/uploadsStore/${id}/${req.file.filename}` : "";

    if (!sectionlistTitle || !setionDescriptions) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if HeaderData document exists
        let userData = await HeaderData.findById(id);

        if (!userData) {
            // 🆕 Create HeaderData doc if it doesn't exist
            userData = new HeaderData({
                _id: id,
                FeatureSectionStore: [],
            });
        }

        let message;

        if (sectionId) {
            // 🔁 Update specific section in FeatureSectionStore by ID
            const section = userData.FeatureSectionStore.id(sectionId);

            if (!section) {
                return res.status(404).json({ message: "Section not found" });
            }

            section.sectionlistTitle = sectionlistTitle;
            section.setionDescriptions = setionDescriptions;
            if (setionImage) section.setionImage = setionImage;

            message = "Feature section updated successfully.";
        } else {
            // ➕ Add a new section
            userData.FeatureSectionStore.push({
                _id: new mongoose.Types.ObjectId(),
                sectionlistTitle,
                setionDescriptions,
                setionImage,
            });

            message = "Feature section created successfully.";
        }

        await userData.save();

        return res.status(200).json({
            message,
            data: userData.FeatureSectionStore,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};





const getFeatureSection = async (req, res) => {
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "User ID Not Found !" })
    }

    try {
        const findDocs = await HeaderData.findById(id).select("FeatureSectionStore")
        if (!findDocs) {
            return res.status(400).send({ message: "Docs is Not found  !" })
        }
        return res.status(200).send({ success: true, data: findDocs.FeatureSectionStore })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal Error" })
    }
}


// const postFeatureSectionListItem = async (request, response) => {
//     const { id } = request.params;
//     const body = request.body;

//     try {

//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return response.status(400).json({ message: "Invalid or missing user ID!" });
//         }

//         const { listlistTitle, listIconeLeft, item_ShowOnWebsite, listIconeRight } = body;

//         const newFeatureItem = {
//             listlistTitle,
//             listIconeLeft,
//             listIconeRight,
//             backGroundImage: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""

//         };

//         const existing = await HeaderData.findOne({ _id: id });

//         if (existing) {


//             (existing.FeatureSectionListItem ??= []).push(newFeatureItem);
//             await existing.save();

//             return response.status(200).json({
//                 message: "New Feature List  item added successfully.",
//                 data: existing
//             });
//         } else {

//             const newUser = new HeaderData({
//                 _id: id,
//                 FeatureSectionListItem: [newFeatureItem]
//             });

//             await newUser.save();

//             return response.status(201).json({
//                 message: "New user document created with Princing item.",
//                 data: newUser
//             });
//         }

//     } catch (error) {
//         console.error("Error saving portfolio item:", error);
//         return response.status(500).json({ error: "Internal server error." });
//     }
// };



const postFeatureSectionListItem = async (request, response) => {
    const { id } = request.params;
    const { listlistTitle, listIconeLeft, listIconeRight, item_ShowOnWebsite } = request.body;

    try {
        // Validate ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID." });
        }

        // Construct new feature item
        const newFeatureItem = {
            listlistTitle,
            listIconeLeft,
            listIconeRight,
            item_ShowOnWebsite,
            backGroundImage: request.file
                ? `/uploadsStore/${id}/${request.file.filename}`
                : ""
        };

        // Check if document exists
        let existingDoc = await HeaderData.findById(id);

        if (existingDoc) {
            // Push new item to existing list
            existingDoc.FeatureSectionListItem ??= [];
            existingDoc.FeatureSectionListItem.push(newFeatureItem);

            await existingDoc.save();

            return response.status(200).json({
                message: "Feature list item added successfully.",
                data: existingDoc
            });
        } else {
            // Create new document if not exists
            const newDoc = new HeaderData({
                _id: id,
                FeatureSectionListItem: [newFeatureItem]
            });

            await newDoc.save();

            return response.status(201).json({
                message: "New document created with feature list item.",
                data: newDoc
            });
        }

    } catch (error) {
        console.error("Error adding feature section list item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
};



const getFeatureSectionListItem = async (req, res) => {
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "User ID Not Found !" })
    }

    try {
        const findDocs = await HeaderData.findById(id).select("FeatureSectionListItem")
        if (!findDocs) {
            return res.status(400).send({ message: "Docs is Not found  !" })
        }
        return res.status(200).send({ success: true, data: findDocs.FeatureSectionListItem })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal Error" })
    }
}

const deleteFeatureListItem = async (request, response) => {
    const { data, pageId } = request.body

    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    FeatureSectionListItem: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Feature Section List Itemes !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}


// FeatureSectionListItem    Uupdate api 

const updateFeatureListItem = async (request, response) => {
    const { userId, userDocID } = request.params
    if (!userId || !userDocID) {
        return res.status(400).send({ message: "Id Not found" })
    }
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const userDocsObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {
            "FeatureSectionListItem.$.listTitle": request.body.listTitle || "",
            "FeatureSectionListItem.$.listIconeLeft": request.body.listIconeLeft || "",
            "FeatureSectionListItem.$.item_ShowOnWebsite": request.body.item_ShowOnWebsite || "",
            "FeatureSectionListItem.$.listIconeRight": request.body.listIconeRight || "",

        };
        if (request.file) {
            updateFields["FeatureSectionListItem.$.backGroundImage"] =
                `/uploadsStore/${request.params.userId}/${request.file.filename}`;
        }


        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "FeatureSectionListItem._id": userDocsObjectId
            },
            {
                $set: updateFields
            },
            {
                new: true
            }
        );
        if (!updatedDoc) {
            return response.status(404).json({ error: "Hero section item not found" });
        }

        return response.status(200).send({
            message: "Portfolio section updated successfully",
            data: updatedDoc
        });

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: "Server error: " });

    }
}



module.exports = {
    updateAndCreateFeatureSectionStore,
    getFeatureSection,
    postFeatureSectionListItem,
    getFeatureSectionListItem,
    deleteFeatureListItem,
    updateFeatureListItem
}