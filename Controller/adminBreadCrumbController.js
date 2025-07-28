const mongoose = require('mongoose');
const { HeaderData } = require('../modelSchema/headerSchema');
const { ObjectId } = mongoose.Types;

const postPortfolioSection = async (request, response) => {
    const { id } = request.params;
    const body = request.body;


    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const { BreadCrumbIcone, item_ShowOnWebsite } = body;

        const BreadCrumbNewItem = {
            BreadCrumbIcone,
            item_ShowOnWebsite,
            breadCrumbImage: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""
        }
        const 
    } catch (error) {
        console.log(error)
    }
}