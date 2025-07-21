const mongoose = require("mongoose")
const { HeaderData } = require("../modelSchema/headerSchema");
const { request, response } = require("express");
const { ObjectId } = mongoose.Types;




const updateAndCreateTeamStore = async (request, response) => {
    const id = request.params.id;
    const sectionId = request.params.sectionId;

    const { teamHeading, teamDescription } = request.body;
    const teamBgImage = request.file ? `/uploadsStore/${id}/${request.file.filename}` : "";

    if (!teamHeading || !teamDescription) {
        return response.status(400).json({ message: "All fields are required" });
    }

    try {

        let userData = await HeaderData.findById(id);

        if (!userData) {

            userData = new HeaderData({
                _id: id,
                TeamHeadingSection: [],
            });
        }

        let message;

        if (sectionId) {

            const section = userData.TeamHeadingSection.id(sectionId);

            if (!section) {
                return response.status(404).json({ message: "Section not found" });
            }

            section.teamHeading = teamHeading;
            section.teamDescription = teamDescription;
            if (teamBgImage) section.teamBgImage = teamBgImage;
            message = "Team  Heading updated successfully.";

        } else {

            userData.TeamHeadingSection.push({
                _id: new mongoose.Types.ObjectId(),
                teamHeading,
                teamDescription,
                teamBgImage,
            });

            message = "Team section created successfully.";
        }

        await userData.save();

        return response.status(200).json({
            message,
            // data: userData.TeamHeadingSection,
        });

    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


const getTeamHeading = async (request, response) => {
    const { id } = request.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).send({ message: "User ID Not Found !" })
    }

    try {
        const findDocs = await HeaderData.findById(id).select("TeamHeadingSection")
        if (!findDocs) {
            return response.status(400).send({ message: "Docs is Not found  !" })
        }
        return response.status(200).send({ success: true, data: findDocs.TeamHeadingSection })


    } catch (error) {
        console.log(error)
        return response.status(500).send({ message: "Internal Error" })
    }
}


const postTeamInformation = async (request, response) => {
    const { id } = request.params;
    const { name, role } = request.body;

    const item_Icone = JSON.parse(request.body.item_Icone);
    const urls = JSON.parse(request.body.urls);
    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const newTeam = {
            name,
            role,
            item_Icone: item_Icone,
            urls: urls,
            image: request.file ? `/uploadsStore/${id}/${request.file.filename}` : ""
        }

        const exsist = await HeaderData.findById({ _id: id })

        if (exsist) {

            // existing.portfolioItems.push(newPortfolioItem);
            (exsist.TeamCardSection ??= []).push(newTeam);
            await exsist.save();

            return response.status(200).json({
                message: "New Team Member added successfully.",
                data: exsist
            });
        } else {

            const newUser = new HeaderData({
                _id: id,
                TeamCardSection: [newTeam]
            });

            await newUser.save();

            return response.status(201).json({
                message: "New user document created with TeamCardSection item.",
                data: newUser
            });
        }

    } catch (error) {
        console.error("Error saving team item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}

const getTeamCard = async (request, response) => {
    const { id } = request.params

    try {

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid or missing user ID!" });
        }

        const findDocs = await HeaderData.findById(id).select("TeamCardSection")
        if (!findDocs) {
            return response.status(400).json({ message: "Invalid or missing user Docs!" });
        }

        return response.status(200).send({ succes: true, data: findDocs.TeamCardSection })

    } catch (error) {
        console.error("Error saving portfolio item:", error);
        return response.status(500).json({ error: "Internal server error." });
    }
}

const deleteTeamCardData = async (request, response) => {
    const { data, pageId } = request.body


    try {
        const result = await HeaderData.findByIdAndUpdate(
            pageId,
            {
                $pull: {
                    TeamCardSection: { _id: new ObjectId(data) }  //  !important 
                }
            },
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        return response.status(200).send({ message: "Delete Successfully TeamCardSection !" })
    } catch (err) {
        response.status(500).json({ error: err.message });

    }
}

const updateTeamMember = async (request, response) => {
    const { id, docsId } = request.params;
    const { name, role } = request.body;

    try {
        if (!docsId || !mongoose.Types.ObjectId.isValid(docsId)) {
            return response.status(400).json({ message: "Invalid team member ID!" });
        }

        const item_Icone = JSON.parse(request.body.item_Icone);
        const urls = JSON.parse(request.body.urls);

        // Find the document that contains this team member
        const userData = await HeaderData.findOne({
            "TeamCardSection._id": new ObjectId(docsId)
        });

        if (!userData) {
            return response.status(404).json({ message: "Team member not found!" });
        }

        // Find the specific team member in the array
        const teamMemberIndex = userData.TeamCardSection.findIndex(
            member => member._id.toString() === docsId
        );

        if (teamMemberIndex === -1) {
            return response.status(404).json({ message: "Team member not found!" });
        }

        // Update the team member data
        const updateData = {
            name: name || userData.TeamCardSection[teamMemberIndex].name,
            role: role || userData.TeamCardSection[teamMemberIndex].role,
            item_Icone: item_Icone || userData.TeamCardSection[teamMemberIndex].item_Icone,
            urls: urls || userData.TeamCardSection[teamMemberIndex].urls,
        };

        // Handle image update if a new image is uploaded
        if (request.file) {
            updateData.image = `/uploadsStore/${id}/${request.file.filename}`;
        } else {
            // Keep the existing image path
            updateData.image = userData.TeamCardSection[teamMemberIndex].image || "";
        }

        // Update the team member
        userData.TeamCardSection[teamMemberIndex] = {
            ...userData.TeamCardSection[teamMemberIndex],
            ...updateData
        };

        await userData.save();

        return response.status(200).json({
            message: "Team member updated successfully.",
            // data: userData.TeamCardSection[teamMemberIndex]
        });

    } catch (error) {
        console.error("Error updating team member:", error);
        return response.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
}




module.exports = {
    updateAndCreateTeamStore,
    getTeamHeading,
    postTeamInformation,
    getTeamCard,
    deleteTeamCardData,
    updateTeamMember
}