// Dependencies and imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const assetStatus = new Schema({
    assetstatus: String
});

// Create schema for AllRoles collection
const roleSchema = new Schema({
    value: Number,
    role: String,
    client: {
        assetstatus: assetStatus
    },
    permitted: Boolean
})
// Export model
module.exports = mongoose.model("Role", roleSchema);