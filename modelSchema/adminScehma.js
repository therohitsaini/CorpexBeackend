const mongoose = require("mongoose")

const permissionSchema = new mongoose.Schema({
    Read: Boolean,
    Create: Boolean,
    Update: Boolean,
    Delete: Boolean,
    Post: Boolean,
}, { _id: false });

const allowPermission = new mongoose.Schema({
    role: { type: String, required: true },
    permission:  [permissionSchema] 
})

const Permissions = new mongoose.model("useraccess", allowPermission)

module.exports = { Permissions }