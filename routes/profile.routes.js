const {Router} = require('express')
const router = Router()
const User = require("../models/User")
const Post = require('../models/Post')
const auth = require('../middleware/auth.middleware')

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)

        if (!user) {return res.status(400).json({message: "Data error, no user with this id"})}

        const data = {
            username: user.username,
            friends: user.friends,
            posts: user.posts
        }
        res.json({user: data})
    } catch (err) {
      res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.json({users: users})
    } catch (err){
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/news' , auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user.friends) return res.status(400).json({message: "No friends"})

        let postsData = {postsDataArray: []}

        for (let i=0; i<user.friends.length; i++){
            let friend = await User.findById(user.friends[i])
            for(let j=0; j<friend.posts.length; j++){
                let post = await Post.findById(friend.posts[j]._id)
                postsData.postsDataArray.push(post)
            }
        }
        postsData.postsDataArray.reverse()
        res.json({postsData: postsData})
    } catch (err) {
        res.status(400).json({err: err.message, message: "Something go wrong, try again"})
    }
})

router.get("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {return res.status(400).json({message: "Data error, no user with this id"})}

        const data = {
            id: user._id,
            username: user.username,
            friends: user.friends,
            posts: user.posts
        }
        res.json({user: data})
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/follow/:followUserId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        let friends = user.friends

        if(! User.findById(req.params.followUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (friends.includes(req.params.followUserId)) {
            return res.status(400).json({message: "User with this id already exist"})
        }

        await User.findByIdAndUpdate(req.user.userId,
            {$addToSet: {friends: req.params.followUserId}})
        res.json({message: "Success following"})
    } catch (err){
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/unfollow/:unfollowUserId', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.userId)
        let friends = user.friends

        if(! User.findById(req.params.unfollowUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (! friends.includes(req.params.unfollowUserId)) {
            return res.status(400).json({message: "No friend with this id"})
        }

        const index = friends.indexOf(req.params.unfollowUserId)
        friends.splice(index, 1)
        await User.findByIdAndUpdate(req.user.userId, {friends: friends})
        res.json({message: "Success unfollowing"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router