const express = require('express')

const app = express()

app.get('', (req, res) => {
    res.send("Main page")
})

app.listen(3000, () => {
    console.log("Server has been started on port 3000 ...")
})