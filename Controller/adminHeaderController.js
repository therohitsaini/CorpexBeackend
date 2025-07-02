

const { response } = require("express");
const { HeaderData } = require("../modelSchema/headerSchema");
const mongoose = require("mongoose")// or: const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


const headerIcone_Data_Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { section, item } = req.body;



        if (!id || !section || !item) {
            return res.status(400).send({
                success: false,
                message: "Missing ID, section, or item"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid MongoDB ID"
            });
        }

        let headerData = await HeaderData.findById(id);

        if (headerData) {

            const existingSections = headerData.headerTopBar || [];
            const sectionIndex = existingSections.findIndex(h => h.section === section);

            if (sectionIndex !== -1) {
                existingSections[sectionIndex].item = item;
            } else {
                existingSections.push({ section, item });
            }

            headerData.headerTopBar = existingSections;
            const updatedDoc = await headerData.save();

            return res.status(200).send({
                success: true,
                message: "Data updated successfully",
                data: updatedDoc
            });

        } else {

            const newDoc = new HeaderData({
                _id: id,
                headerTopBar: [{ section, item }]
            });

            const created = await newDoc.save();

            return res.status(201).send({
                success: true,
                message: "New document created successfully",
                data: created
            });
        }

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};



const getHeaderData = async (request, response) => {
    try {
        const { id } = request.params
        const getData = await HeaderData.findById(id)

        return response.status(200).send({ success: true, userData: getData })

    } catch (error) {
        return response.status(500).send({ message: "Somthing Went Wrong ", success: false, error })
    }

}

const logo_ = async (req, res) => {
    const { id } = req.params
    const { section, textLogo } = req.body;
    let item = [];

    try {
        if (req.body.item) {
        }

        if (section === "Logo") {
            if (req.file) {
                item = [{
                    item_Title: "Logo",
                    item_IconeUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
                }];
            } else if (textLogo) {
                item = [{
                    item_Title: textLogo,
                    item_IconeUrl: ""
                }];
            }
        }

        let doc = await HeaderData.findOne(id);

        if (!doc) {

            doc = new HeaderData({
                id,
                headerTopBar: [{ section, item }]
            });
        } else {

            const existingSection = doc.headerTopBar.find(s => s.section === section);
            if (existingSection) {
                existingSection.item = item;
            } else {
                doc.headerTopBar.push({ section, item });
            }
        }

        await doc.save();
        res.status(200).json({ success: true, data: doc });

    } catch (error) {
        console.error("Error saving section:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}



const updateHeroSection = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "HeaderData ID is required" });
        }

        const {
            heroPlay_Button,
            heroSlideSubTitle,
            heroSlideTitle,
            heroButton_One,
            heroButton_Two
        } = req.body;
        // console.log(req.body)

        const newHeroSection = {
            heroPlay_Button,
            heroSlideSubTitle,
            heroSlideTitle,
            heroButton_One,
            heroButton_Two,
            heroImgUrl: req.file ? `/uploadsStore/${id}/${req.file.filename}` : ""   // !/ (scalse is important)
        };


        const updatedDoc = await HeaderData.findByIdAndUpdate(
            id,
            { $push: { HeroSection: newHeroSection } },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "HeaderData not found" });
        }

        res.status(200).json({
            message: "Hero section updated successfully",
            data: updatedDoc
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};



// updateDOCS
const updateSliderData = async (req, res) => {
    const { userId, userDocID } = req.params;


    if (!userId || !userDocID) {
        return res.status(400).send({ message: "Id Not found" })
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const heroObjectId = new mongoose.Types.ObjectId(userDocID);

        const updateFields = {
            "HeroSection.$.heroPlay_Button": req.body.heroPlay_Button || "",
            "HeroSection.$.heroSlideSubTitle": req.body.heroSlideSubTitle || "",
            "HeroSection.$.heroSlideTitle": req.body.heroSlideTitle || "",
            "HeroSection.$.heroButton_One": req.body.heroButton_One || "",
            "HeroSection.$.heroButton_Two": req.body.heroButton_Two || ""
        };

        if (req.file) {
            updateFields["HeroSection.$.heroImgUrl"] = `/uploads/${req.file.filename}`;
        }

        const updatedDoc = await HeaderData.findOneAndUpdate(
            {
                _id: userObjectId,
                "HeroSection._id": heroObjectId
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
            message: "Hero section updated successfully",
            data: updatedDoc
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};


const getHeroSectionDataID = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing document ID" });
        }

        const document = await HeaderData.findById(id).select('HeroSection');;

        if (!document || !document.HeroSection || document.HeroSection.length === 0) {
            return res.status(404).json({ message: "Hero section not found" });
        }


        const heroSection = document.HeroSection;

        res.status(200).json({
            message: "Hero section fetched successfully",
            data: heroSection
        });

    } catch (err) {
        console.error("Error fetching hero section:", err);
        res.status(500).json({ error: err.message });
    }
};

//--------------------------------- Delete Apis ---------------------------------

const deleteKeyDataByID = async (request, response) => {
    const { data, pageId } = request.body


    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    HeroSection: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ success: true })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}


// <--------------------------------- FunFat  Section Apis Start ----------------------------->



const funfactGetData = async (request, response) => {
    try {
        const { id } = request.params
        const getData = await HeaderData.findById(id).select('FunfactBox');
        return response.status(200).send({ success: true, data: getData.FunfactBox, })
    }
    catch (err) {
        response.status(500).json({ error: err.message });

    }
}



// ----------------------------- Delete header data -----------------------------------

const deleteHeaderSection = async (request, response) => {
    const { data, pageId } = request.body


    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    headerTopBar: { _id: data }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ success: true })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}

// <--------------------------------- FunFat  Section Apis End ----------------------------->

module.exports = {
    headerIcone_Data_Update,
    getHeaderData,
    updateHeroSection,
    // getSeriveCardDataID,
    deleteKeyDataByID,
    // funfactUpdate,
    funfactGetData,
    getHeroSectionDataID,
    updateSliderData,
    deleteHeaderSection,
    logo_
}





// const deleteHeroSectionById = async (req, res) => {
//   try {
//     const { parentId, userSectionId } = req.params;

//     const updatedDoc = await HeaderData.findByIdAndUpdate(
//       parentId,
//       { $pull: { HeroSection: { _id: userSectionId } } },
//       { new: true }
//     );

//     if (!updatedDoc) {
//       return res.status(404).json({ success: false, message: 'Document not found' });
//     }

//     res.status(200).json({ success: true, message: 'Item deleted', data: updatedDoc });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
