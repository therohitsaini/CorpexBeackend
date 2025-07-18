const { HeaderData } = require("../modelSchema/headerSchema");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;



const CreateHeadingAndUpdate = async (req, res) => {
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

        let sectionHeading = await HeaderData.findById(id);

        if (sectionHeading) {

            const existingSections = sectionHeading.SectionHeadingTop || [];
            const sectionIndex = existingSections.findIndex(h => h.section === section);

            if (sectionIndex !== -1) {
                existingSections[sectionIndex].item = item;
            } else {
                existingSections.push({ section, item });
            }

            sectionHeading.SectionHeadingTop = existingSections;
            const updatedDoc = await sectionHeading.save();

            return res.status(200).send({
                success: true,
                message: "Added successfully !",
                data: updatedDoc
            });

        } else {

            const newDoc = new HeaderData({
                _id: id,
                SectionHeadingTop: [{ section, item }]
            });

            const created = await newDoc.save();

            return res.status(201).send({
                success: true,
                message: "New document created successfully",
                // data: created
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

const getHeadingData = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response.status(400).send({ message: "Plese Log In Again" })
        }
        const getData = await HeaderData.findById(id).select("SectionHeadingTop")

        return response.status(200).send({ success: true, data: getData.SectionHeadingTop })

    } catch (error) {
        return response.status(500).send({ message: "Somthing Went Wrong ", success: false, error })
    }

}


module.exports = {
    CreateHeadingAndUpdate,
    getHeadingData
}
