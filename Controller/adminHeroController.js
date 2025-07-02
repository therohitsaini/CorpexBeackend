const mongoose = require('mongoose');
const { HeaderData } = require("../modelSchema/headerSchema")




const getHeroDataByID = async (request, response) => {
    const { id } = request.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }
        const findID = await HeaderData.findById(id).select("HeroSection")
        if (!id) {
            return response.status(400).send({ message: "Data is not Exsist !" })
        }
        return response.status(200).send({ succes: true, data: findID.HeroSection })
    } catch (error) {
        console.log(error)
        return response.status(500).send({ succes: false })
    }

}

module.exports = {
    getHeroDataByID
}