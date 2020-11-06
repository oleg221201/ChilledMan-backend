const {Schema, model, Types} = require("mongoose")

const schema = Schema({
    text: {type: String, required: true},
    owner: {type:Types.ObjectId, ref: "User"}
})

module.exports = model("Comment", schema)