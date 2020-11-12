const {Router} = require('express')
const router = Router()
const User = require("../models/User")
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

router.get('/follow/:followUserId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        let friends = user.friends

        if(! User.findById(req.params.followUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (friends.includes(req.params.followUserId)) {
            return res.status(400).json({message: "Friend with this id already exist"})
        }

        await User.findByIdAndUpdate(req.user.userId,
            {$addToSet: {friends: req.params.followUserId}})
        res.json({message: "Success following"})
    } catch (err){
        res.status(400).json({message: "Something go wrong, try again."})
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