
const { UserData, UserData_ } = require("../modelSchema/userSchema")
require("dotenv").config()
const bcript = require("bcrypt")
const saltRound = 10
const nodemailer = require("nodemailer")
const JWT = require("jsonwebtoken")
const path = require("path")
const { request, response } = require("express")
const JWT_SRCURITE_KEY = process.env.TOKEN_SECRITE_KEY
const gmail_key = process.env.GMAIL_SECRET_KEY
const password_key = process.env.PASSWORD_SECRET_KEY
const forget_key = process.env.FORGET_TOKEN_SECRITE_KEY
const express = require("express");
const app = express()

// const storage = multer.diskStorage({
//     destination: (request, file, cd) => {
//         cd(null, "upload/")
//         filename: (request, file, cd) => {
//             const suffix = Date.now()
//             cd(null, suffix + '-' + file.originalname)
//         }
//     }
// })
// const upload = multer({ storage })




const getAllUser = async (request, response) => {         // ------> Get All User API -------> //
    try {

        const allUsers = await UserData_.find()
        return response.status(200).send({ data: allUsers })

    } catch (err) {
        console.log("ERROR", err)
    }

}

const signUp = async (request, response) => {                       // ------> Sign Up  API -------> //

    try {
        const body = request.body
        const password = body.password
        const findUsername = await UserData_.findOne({ username: body.username })
        const findEmail = await UserData_.findOne({ email: body.email })



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
            password: hashPassword

        })

        await object.save()
        return response.status(201).send({ massage: "sign up sucessfully ...!" })

    } catch (err) {
        console.log(err)
        return response.status(400).send({ massage: "sign up field ...!", err })
    }
}

const signIn = async (request, response) => {                  // ------> Sign In  API -------> //
    try {
        const body = request.body
        console.log("body", body)

        // const find_User = await UserData_.findOne({ email: body.email_Useranme }) || await UserData_.findOne({ username: body.email_Useranme })
        const find_User = await UserData_.findOne({
            $or: [
                { email: body.email_Username },
                { username: body.email_Username }
            ]
        });

        if (!find_User) {
            return response.status(400).send({ massage: "Incrrect Details ...!" })
        }

        if (!find_User.userStatus) {
            return response.status(400).send({ massage: "You account is deactiveted !!" })
        }


        const compairPassword = await bcript.compare(body.password, find_User.password)

        if (!compairPassword) {
            return response.status(400).send({ massage: "Incrrect password ... ! " })
        }


        const Token = JWT.sign(body, JWT_SRCURITE_KEY, { expiresIn: "1h" })
       
        return response.send({ massage: "Sign in successfully ", data: Token, userData: find_User })


    } catch (err) {
        return response.status(400).send({ massage: "Inccrect Email ...!", err })

    }

}

// const forgetPasswordApi = async (request, response) => {
//     try {
//         const { email } = request.body;
//         console.log("Email", email)


//         const findEmail = await UserData.findOne({ email })
//         if (!findEmail) {
//             return response.status(400).send({ massage: "Email Not Found  ...!" })
//         }

//         const jwt_forget_token = JWT.sign({ email }, process.env.FORGET_TOKEN_SECRITE_KEY, { expiresIn: "10m" });

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             // secure: true,
//             auth: {
//                 user: process.env.GMAIL_SECRITE_KEY,
//                 pass: process.env.PASSWORD_SECURITE_KAY
//             },

//         })

//         const receiver = {
//             from: process.env.GMAIL_SECRITE_KEY,
//             to: email,
//             subject: "Fassword Forget Request",
//             text: `Click on this link for forget password ${process.env.CLIENT_URL},Reset password${jwt_forget_token} `

//         }

//         transporter.sendMail(receiver)
//             .then(() => response.status(200).send({ message: "Reset link sent to your email" }))
//             .catch(err => {
//                 console.error("ERROR", err);
//                 return response.status(400).send({ message: "Failed to send email" });
//             });


//         return response.status(200).send({ massage: "Send link in your email " })
//     } catch (error) {
//         console.log("error", error)
//         return response.status(400).send({ massage: "Not Found ...!", })
//     }

// }
// const forgetPasswordApi = async (request, response) => {
//     try {
//         const { email } = request.body;
//         console.log("Email:", email);

//         const findEmail = await UserData.findOne({ email });
//         if (!findEmail) {
//             return response.status(400).send({ message: "Email not found!" });
//         }


//         const jwtForgetToken = JWT.sign(
//             { email },
//             "rohit12345rfderfjjjj3333333",
//             { expiresIn: "10m" }
//         );

//         const transporter = nodemailer.createTransport({
//             secure: true,
//             service: "gmail.com",
//             host: "smtp.gmail.com",
//             service: "gmail.com",
//             port: 465,
//             auth: {
//                 user: "rohit.sangod74@gmail.com",
//                 pass: "afrghkucqnepotcg",
//             },
//         });


//         const reciver = {
//             from: "rohit.sangod74@gmail.com",
//             to: email,
//             subject: "Password Reset Request",
//             text: `You requested to reset your password. ${process.env.CLIENT_URL}/reset-password?token=${jwtForgetToken}.`,
//         };

//         await transporter.sendMail(reciver);
//         return response.status(200).send({ message: "Reset link sent to your email" });

//     } catch (error) {
//         console.error("Server error:", error);
//         return response.status(500).send({ message: "Something went wrong!" });
//     }
// };

const forgetPasswordApi = async (request, response) => {
    try {
        const { email } = request.body;
        console.log("Email:", email);

        const findEmail = await UserData_.findOne({ email });
        if (!findEmail) {
            return response.status(400).send({ message: "Email not found!" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "rohit.sangod74@gmail.com",
                pass: "afrghkucqnepotcg",
            },
        });


        const reciver = {
            from: "sainiweb@gmail.com",
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=`
        };

        // Send email
        await transporter.sendMail(reciver);
        return response.status(200).send({ message: "Reset link sent to your email" });

    } catch (error) {
        console.error("Server error:", error);
        return response.status(500).send({ message: "Something went wrong!" });
    }
};


const getUserByID = async (request, response) => {                          // ------> Get User By ID API -------> //
    try {
        const { id } = request.params
        console.log("ID", id)
        const find_Data = await UserData_.findById(id)
        console.log(find_Data)
        response.status(200).send({ massage: "Get Data Succefully ...!", find_Data })

    } catch (error) {
        console.log(error)
        response.status(400).send({ massage: "Somthing went Wrong...!", error })
    }

}

const updateUserData = async (request, response) => {                   // ------> Update User Data API -------> //

    try {
        const { id } = request.params

        const body = request.body
        // console.log("bodyUpdate", body.gender)
        const updateUserProfile = await UserData_.findByIdAndUpdate(id, body)

        if (body.contactnumber.length !== 10) {
            return response.status(400).send({ massage: "Invailid Contact Number", })

        }
        if (/\s/.test(request.body.username)) {
            return response.status(400).json({ massage: 'Username cannot contain spaces' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (/\s/.test(request.body.email) || !emailRegex.test(body.email)) {
            return response.status(400).json({ massage: 'Invailid Email !' });
        }

        return response.status(200).send({ massage: "Profile update succesfully!", updateUserProfile })

    } catch (error) {
        console.log(error)
        response.status(400).send({ massage: "Somthing went Wrong...!", error })
    }
}

const uploadProfileFile = async (request, response) => {             //-------->    penting profile picture    ---------//
    try {
        const { id } = request.params;
        const { filename } = request.file
        console.log("sumit-img", id, filename)
        const image = await UserData_.findByIdAndUpdate(id, { filename })
        console.log("image", request.file)

        await image.save()
        return response.status(200).send({ massage: "file upload succefully ! " })
    } catch (error) {
        console.log("error", error)
        return response.status(404).send({ massage: "Internal Error ..!", error })
    }
};

const userUploadProfileFile = async (request, response) => {             //-------->    penting profile picture    ---------//
    try {
        const { id } = request.params;
        const { filename } = request.file
        // console.log("sumit-img", request.file)
        const image = await UserData_.findByIdAndUpdate(id, { filename })
        // console.log("image", request.file)

        await image.save()
        return response.status(200).send({ massage: "file upload succefully ! " })
    } catch (error) {
        console.log("error", error)
        return response.status(404).send({ massage: "Internal Error ..!", error })
    }
};

const getProfilePicture = async (request, response) => {      // ------> Get Profile API -------> //

    try {
        const { id } = request.params;
        const find_Image = await UserData_.findById(id);

        if (!find_Image || !find_Image.filename) {
            return response.status(404).send({ message: "Image not found" });
        }

        // Construct full image URL
        const imgURL = `${request.protocol}://${request.get('host')}/uploads/${find_Image.filename}`;
        return response.status(200).send({ message: "Image found", imgURL });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: "Internal server error", error });
    }

};

const resetPassword = async (request, response) => {                 // ------> Reset Password  API -------> //
    try {
        const { id } = request.params;
        const { old_Password, password } = request.body;

        console.log("password", id, old_Password, password)


        const user = await UserData_.findById(id);
        if (!user) {
            return response.status(404).send({ message: "User not found" });
        }


        const isMatch = await bcript.compare(old_Password, user.password);
        if (!isMatch) {
            return response.status(400).send({ message: "Incorrect old password!" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).send({
                message: "Password must be at least 8 characters and include [a-z, A-Z, 0-9, and !@#$&*]"
            });
        }
        if (old_Password === password) {
            return response.status(400).send({
                message: "Use Diffrent Password  !"
            });
        }

        const hashedPassword = await bcript.hash(password, saltRound);
        user.password = hashedPassword;
        await user.save();

        response.status(200).send({ message_: "Password reset successfully!" });

    } catch (error) {
        console.error(error);
        response.status(500).send({ message: "Something went wrong!" });
    }
};



module.exports = {
    getAllUser,
    signUp,
    signIn,
    forgetPasswordApi,
    getUserByID,
    updateUserData,
    uploadProfileFile,
    resetPassword,
    getProfilePicture,
    userUploadProfileFile
}