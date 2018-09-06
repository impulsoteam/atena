const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const qs = require('querystring')

const app = express()
const port = process.env.PORT || 3000
const gaKey = process.env.GA_KEY || 'UA-101595764-2'

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.get('/', (req, res) => {
    res.send("i'm alive!")
})

app.get('/event', (req, res) => {
    console.log(req.body)

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
        "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
        "type": "url_verification"
    }))
})

app.listen(port, () => console.info(`Listening on port ${port}`))