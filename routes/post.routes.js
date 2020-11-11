const {Router} = require('express')
const router = Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')

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

router.post('', async (req, res) => {
    try{
        const post = {
            text: req.body.text,
            owner: req.body.userId
        }
        const result = await Post.create(post)
        res.json({postId: result.id, message: "Post created successfully"})
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.put('', async (req, res) => {
    try {
        let loading = false
        const post = await Post.findById(req.body.postId)

        if (!post){
            return res.status(400).json({message: "Something go wrong, try again"})
        }

        if (req.body.text && req.body.userId.toString() === post.owner.toString()){
            await Post.findByIdAndUpdate(req.body.postId,
                {text: req.body.text})
            loading = true
        }

        if (req.body.comment){
            const comment = await Comment.create({text: req.body.comment, owner: req.body.userId})
            await Post.findByIdAndUpdate(req.body.postId,
                {$addToSet: {comments: comment.id}})
            loading = true
        }

        if (req.body.likeUserId){
            if (post.likes.includes(req.body.likeUserId)){
                const index = post.likes.indexOf(req.body.likeUserId)
                post.likes.splice(index, 1)
                await Post.findByIdAndUpdate(req.body.postId, {likes: post.likes})
            }
            else {
                await Post.findByIdAndUpdate(req.body.postId,
                    {$addToSet: {likes: req.body.likeUserId}})
            }
            loading = true
        }

        if (loading) res.json({message: "Post updated successfully"})
        else res.json({message: "Error, no suitable params"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        await Post.findByIdAndDelete(req.params.id)
        res.json({message: "Post deleted successfully"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router