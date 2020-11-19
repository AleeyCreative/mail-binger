const express = require('express')
const bodyParser = require('body-parser')
const appSetup = require('./appSetup.js')
const dotenv = require('dotenv')
const ngrok = require('ngrok')
const router = require('./router')
dotenv.config()
const app = new express()

async () => await appSetup(app)

const port  = process.env.PORT || 3200
app.use('/', router)

app.listen(port, (err) => {
    if(err) return console.log(err.message)
    console.log(`App is running on port ${port}`)
    ngrok.connect()
        .then(url => console.log(url))
        .catch(err => console.log(err.message))
})