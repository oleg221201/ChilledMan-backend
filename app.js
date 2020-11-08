const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))

app.get('', async (req, res) => {
    res.send("Main page")
})

async function startApp () {
    try{
        await mongoose.connect(config.get("mongoDB_URL"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(3000, () => {
            console.log("Server has been started on port 3000 ...")
        })
    } catch (err) {
        console.log("Error", err.message)
        process.exit(1)
    }
}

startApp()