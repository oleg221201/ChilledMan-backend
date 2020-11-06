const {Schema, model, Types} = require('mongoose')

const schema = Schema({
    text: {type: String, required: true},
    owner: {type: Types.ObjectId, ref: "User", required: true},
    likes: [{type: Types.ObjectId, ref: "User"}],
    comments: [{type: Types.ObjectId, ref: "Comment"}]
})

module.exports = model('Post', schema)