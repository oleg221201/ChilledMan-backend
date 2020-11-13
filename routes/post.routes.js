const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')

router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if (! post) {
            return res.status(400).json({message: "No post with this id"})
        }
        res.json({post: post})
    } catch (err) {
      res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.post('', auth, async (req, res) => {
    try{
        const post = {
            text: req.body.text,
            owner: req.user.userId
        }
        const result = await Post.create(post)
        await User.findByIdAndUpdate(req.user.userId, {
            $addToSet: {posts: result.id}})
        res.json({postId: result.id, message: "Post created successfully"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.put('', auth, async (req, res) => {
    try {
        let loading = false
        const post = await Post.findById(req.body.postId)

        if (!post){
            return res.status(400).json({message: "Something go wrong, try again"})
        }

        if (req.body.text && req.user.userId.toString() === post.owner.toString()){
            await Post.findByIdAndUpdate(req.body.postId,
                {text: req.body.text})
            loading = true
        }

        if (req.body.comment){
            const comment = await Comment.create({text: req.body.comment, owner: req.user.userId})
            await Post.findByIdAndUpdate(req.body.postId,
                {$addToSet: {comments: comment.id}})
            loading = true
        }

        if (req.body.like){
            if (post.likes.includes(req.user.userId)){
                const index = post.likes.indexOf(req.user.userId)
                post.likes.splice(index, 1)
                await Post.findByIdAndUpdate(req.body.postId, {likes: post.likes})
            }
            else {
                await Post.findByIdAndUpdate(req.body.postId,
                    {$addToSet: {likes: req.user.userId}})
            }
            loading = true
        }

        if (loading) res.json({message: "Post updated successfully"})
        else res.json({message: "Error, no suitable params"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        const user = await User.findById(req.user.userId)
        let posts = user.posts
        const index = posts.indexOf(req.params.id)
        posts = posts.splice(index, 1)
        await User.findByIdAndUpdate(req.user.userId, {posts: posts})
        res.json({message: "Post deleted successfully"})
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router