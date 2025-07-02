
require("dotenv").config()
const bcript = require("bcrypt")
const saltRound = 10
const { Permission_Data } = require("../modelSchema/permission");
const { UserData_ } = require("../modelSchema/userSchema");
const { request, response } = require("express");
const { Permissions } = require("../modelSchema/adminScehma");
const mongoose = require("mongoose")
// const { request, response } = require("express");

const RoleUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        // console.log("id", body)

        if (id === "6824dbccbf4b61d424149bf0") {
            return res.status(400).send({ massage: "You can not role change" })
        }
        const updatedUser = await UserData_.findByIdAndUpdate(
            { _id: id },
            body
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).send({
            massage: "User role updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            message: "Something went wrong while updating role.",
            error: error.message
        });
    }
};

const setRolePermission = async (request, response) => {
    try {
        const { user_Permission } = request.body

        const object = new Permission_Data({
            user_Permission
        })

        await object.save()
        return response.status(201).send({ massage: "sign up sucessfully ...!" })
    } catch (error) {
        console.log(error)
    }
}

const getuserPermission = async (request, response) => {
    try {
        const find_permission = await Permission_Data.findOne()
        // console.log(find_permission)
        return response.status(200).send({ massage: "Get data Succesfully !", find_permission })

    } catch (error) {
        console.log(error)
    }
}

const signUpAdminController = async (request, response) => {                       // ------> Sign Up  API -------> //

    try {
        const body = request.body
        const password = body.password
        const findUsername = await UserData_.findOne({ username: body.username })
        const findEmail = await UserData_.findOne({ email: body.email })
        // console.log("body", body)

        const obj_Length = Object.keys(body)

        if (obj_Length.length == 0) {
            return response.status(400).send({ massage: "Empty ...!" })
        }

        if (/\s/.test(request.body.username)) {
            return response.status(400).json({ massage: 'Username cannot contain spaces' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(body.email)) {
            return response.status(400).send({ message: "Invalid Email...!" });
        }
        if (body.email == "@gmail.com") {
            return response.status(400).send({ massage: "Invailid Email r.....!" })
        }

        if (findUsername) {
            return response.status(400).send({ massage: "Username is Alredy Exsist ...!" })
        }

        if (findEmail) {
            return response.status(400).send({ massage: "Email is Alredy Exsist ...!" })
        }

        if (
            password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$&*]/.test(password)
        ) {
            return response.status(400).send({
                massageReq: "Password must be at least 8 characters and include ( [a-z],[A-Z],[0-9],[!@#$&*] )"
            });
        }

        const hashPassword = await bcript.hash(password, saltRound)

        const object = new UserData_({

            fullname: body.fullname,
            username: body.username,
            email: body.email,
            password: hashPassword,
            permission: body.permission

        })

        await object.save()
        return response.status(201).send({ massage: "Create User Succesfully !" })

    } catch (err) {
        console.log(err)
        return response.status(400).send({ massage: "sign up field ...!", err })
    }
}

const deleteUserController = async (request, response) => {
    const { id } = request.params
    // console.log("id", id)
    try {

        const findUser = await UserData_.findByIdAndDelete(id)

        if (!findUser) {
            return response.status(404).send({ massage: " User Note Found ! " })
        }

        return response.status(200).send({ massage: " User Deleted ! " })
    } catch (error) {
        console.log(error)
        return response.status(400).send({ message: "Internal Error", success: false, })
    }
}

const postRolePermission = async (request, response) => {
    try {
        const body = request.body
        // console.log(request.body)
        // console.log(body.isCheck)
        const data = new Permissions({
            role: body.role,
            permission: body.permission
        })
        await data.save()
        response.status(201).send({ success: true })

    } catch (error) {
        console.log(error)

    }
}

const getRolePermission = async (request, response) => {
    try {
        const find_Data = await Permissions.findOne()
        return response.status(200).send({ find_Data })

    } catch (error) {
        return response.status(400).send({ success: false })
    }
}

const updateRoleInformation = async (request, response) => {
    try {
        const { id } = request.params

        const body = request.body
        // console.log("bodyUpdate", body)
        const updateUserProfile = await UserData_.findByIdAndUpdate(id, body)


        if (/\s/.test(request.body.username)) {
            return response.status(400).json({ massage: 'Username cannot contain spaces' });
        }

        // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // if (/\s/.test(request.body.email) || !emailRegex.test(body.email)) {
        //     return response.status(400).json({ massage: 'Invailid Email !' });
        // }

        return response.status(200).send({ massage: "Profile update succesfully!", updateUserProfile })

    } catch (error) {
        console.log(error)
        response.status(400).send({ massage: "Somthing went Wrong...!", error })
    }
}

const getRoleDataByID = async (request, response) => {
    try {
        const { id } = request.params
        // console.log("id", id)
        const data = await UserData_.findById(id)
        return response.status(200).send({ success: true, data: data })

    } catch (error) {
        return response.status(400).send({ massage: "Somthing went Wrong...!", error })

    }

}



const deleteAllUserController = async (req, res) => {
    try {
        const { ids } = req.body;

        console.log("Raw ids received:", ids);

        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: '"ids" must be an array.' });
        }


        const result = await UserData_.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            message: 'Users deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// adminRoute.delete("/delete-all-user/", deleteAllUserController);


const userStatus = async (request, response) => {
    try {
        const { id } = request.params;
        const { status } = request.body
    
        await UserData_.findByIdAndUpdate(id, { userStatus: status });
        return response.status(200).send({ success: "true" })

    } catch (error) {

        console.error(error);
        return response.status(500).json({ message: 'Server error' });
    }
}
const getStatus = async (request, response) => {
    try {
        const { id } = request.params
        const findUser = await UserData_.findById(id)
        if (!findUser) {
            return response.status(400).send({ message: "User not found !" })
        }
        response.status(200).send({ success: true, findUser })

    } catch (error) {
        console.log(error)
        return response.status(500).json({ message: 'Server error' });

    }
}


module.exports = {

    RoleUpdate,
    getStatus,
    userStatus,
    setRolePermission,
    getuserPermission,
    signUpAdminController,
    deleteUserController,
    postRolePermission,
    getRolePermission,
    updateRoleInformation,
    getRoleDataByID,
    deleteAllUserController

};
