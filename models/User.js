const {Schema, model, Types} = require('mongoose')

const schema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    posts: [{type: Types.ObjectId, ref: 'Post'}],
    friends: [{type: Types.ObjectId, ref: 'User'}]
})

module.exports = model('User', schema)