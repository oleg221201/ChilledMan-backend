const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/post', require('./routes/post.routes'))

app.get('', async (req, res) => {
    res.send("Main page")
})

async function startApp () {
    try{
        await mongoose.connect(config.get("mongoDB_URL"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(4000, () => {
            console.log("Server has been started on port 4000 ...")
        })
    } catch (err) {
        console.log("Error", err.message)
        process.exit(1)
    }
}

startApp()