const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const qs = require('querystring')
const { createEventAdapter } = require('@slack/events-api')
const app = express()
const signingSecret = 'cf2bf83a1901bdfd661167c3005506dc'
const port = process.env.PORT || 3000
const gaKey = process.env.GA_KEY || 'UA-101595764-2'

const slackEvents = createEventAdapter(signingSecret)

const handleResponse = r => {
    console.info(r)
    return r
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.get('/', (req, res) => res.send("i'm alive!"))

app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('message', e => handleResponse(e))

slackEvents.on('reaction_added', e => handleResponse(e))

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))