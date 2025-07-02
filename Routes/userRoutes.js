const express = require("express")
const { getAllUser, signUp, signIn, forgetPasswordApi, getUserByID, updateUserData, uploadProfileFile, resetPassword, getProfilePicture, userUploadProfileFile } = require("../Controller/userController")
const { upload } = require("../Middleware/FileStorage")
const userRoute = express.Router()

userRoute.get("/users", getAllUser)
userRoute.post("/signup", signUp)
userRoute.post("/sign_in", signIn)
userRoute.post("/forget-password/api", forgetPasswordApi)
userRoute.get("/get/user-data-by-id/:id", getUserByID)
userRoute.put("/update/profile/:id", updateUserData)
userRoute.put("/update/profile-picture/:id", upload.single("image"),uploadProfileFile)
// userRoute.put("/update/profile-picture-role/:id", upload.single("image"), userUploadProfileFile)
userRoute.put("/reset-password-id/:id", resetPassword)
userRoute.get("/get-profile/:id", getProfilePicture)


module.exports = { userRoute }