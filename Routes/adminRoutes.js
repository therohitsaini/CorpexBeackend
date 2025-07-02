// routes/adminRoute.js
const express = require("express");
const {
    RoleUpdate,
    setRolePermission,
    getuserPermission,
    signUpAdminController,
    deleteUserController,
    postRolePermission,
    getRolePermission,
    updateRoleInformation,
    getRoleDataByID,
    deleteAllUserController,
    userStatus,
    getStatus
} = require("../Controller/adminController");



const adminRoute = express.Router();


adminRoute.put("/role/update/:id", RoleUpdate);
adminRoute.post("/set-permission/", setRolePermission)
adminRoute.get('/permission/', getuserPermission)
adminRoute.post("/create-user-by-admin/", signUpAdminController)
adminRoute.delete("/user-delete/:id", deleteUserController)
adminRoute.post("/post-permission/", postRolePermission)
adminRoute.get("/get-role-permission", getRolePermission)
adminRoute.put("/update-role-info/:id", updateRoleInformation)
adminRoute.get("/get-role-data/:id", getRoleDataByID)
adminRoute.delete("/delete-all-user/", deleteAllUserController)
adminRoute.put("/change-satuts/:id", userStatus)
adminRoute.get("/get-status/:id", getStatus)

module.exports = { adminRoute };
