const {Router} = require('express')
const router = Router()
const User = require("../models/User")

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

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

router.get('/follow/:currentUserId/:followUserId', async (req, res) => {
    try {
        const user = await User.findById(req.params.currentUserId)
        let friends = user.friends

        if(! User.findById(req.params.followUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (friends.includes(req.params.followUserId)) {
            return res.status(400).json({message: "Friend with this id already exist"})
        }

        friends.unshift(req.params.followUserId)
        await User.findByIdAndUpdate(req.params.currentUserId, {friends: friends})
        res.json({message: "Success following"})
    } catch (err){
        res.status(400).json({message: "Something go wrong, try again."})
    }
})

router.get('/unfollow/:currentUserId/:unfollowUserId', async (req, res) => {
    try{
        const user = await User.findById(req.params.currentUserId)
        let friends = user.friends

        if(! User.findById(req.params.unfollowUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (! friends.includes(req.params.unfollowUserId)) {
            return res.status(400).json({message: "No friend with this id"})
        }

        const index = friends.indexOf(req.params.unfollowUserId)
        friends.splice(index, 1)
        await User.findByIdAndUpdate(req.params.currentUserId, {friends: friends})
        res.json({message: "Success unfollowing"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router