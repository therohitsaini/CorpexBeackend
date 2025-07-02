const mongoose = require("mongoose")

const permission = new mongoose.Schema({
    addPermission: { type: [String], required: true }

})

const Permission_Data = mongoose.model("user_permissions", permission)

module.exports = { Permission_Data }