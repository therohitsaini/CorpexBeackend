const { HeaderData } = require("../modelSchema/headerSchema");



const updateAndCreateFeatureSectionStore = async (req, res) => {
    const { id } = req.params;

    const sectionTitle = req.body.sectionTitle;
    const setionDescriptions = req.body.setionDescriptions;
    const setionImage = req.file ? `/uploadsStore/${id}/${req.file.filename}` : ""

    if (!sectionTitle || !setionDescriptions) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userData = await HeaderData.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found with given ID." });
        }

        
        const existingIndex = userData.FeatureSectionStore.findIndex(
            (item) => item.sectionTitle === sectionTitle
        );

        if (existingIndex !== -1) {
            userData.FeatureSectionStore[existingIndex].setionDescriptions = setionDescriptions;
            if (setionImage) {
                userData.FeatureSectionStore[existingIndex].setionImage = setionImage;
            }
        } else {
            userData.FeatureSectionStore.push({
                sectionTitle,
                setionDescriptions,
                setionImage,
            });
        }

        await userData.save();

        return res.status(200).json({
            message: existingIndex !== -1
                ? "Feature section updated successfully."
                : "Feature section created successfully.",
            data: userData.FeatureSectionStore,
        });

    } catch (error) {
        console.error("Error in FeatureSectionStore:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {
    updateAndCreateFeatureSectionStore
}