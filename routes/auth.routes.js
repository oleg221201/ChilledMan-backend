const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const config = require('config')

router.post('/registration',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum length of password is 4 symbols').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.json({
                    message: "Invalid register data",
                    err: errors.array()
                })
            }

            const {email, password, username} = req.body

            if(! await User.findOne({email})){
                return res.json({message: "User already exists"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            await User.create({email, password: hashedPassword, username})
            res.json({message: "User has been created"})
        } catch (err) {
            res.json({message: "Something go wrong, try again", err: err.message})
        }
    })

router.post('/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.json({
                    message: "Invalid login data",
                    err: errors.array()
                })
            }

            const {email, password} = req.body
            const user = await User.findOne({email})
            if (! user){
                return res.json({message: "Something go wrong, try again"})
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password)
            if (!isCorrectPassword){
                return res.json({message: "Something go wrong, try again"})
            }

            const token = jwt.sign(
                {userId: user._id},
                config.get('jwtSecretKey'),
                {expiresIn: "2h"}
            )

            res.json({token, userId: user._id})
        } catch (err) {
            res.json({message: "Something go wrong, try again", err: err.message})
        }
    })

module.exports = router