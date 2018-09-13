const express = require('express')
const { createEventAdapter } = require('@slack/events-api')
const request = require('request')
const qs = require('querystring')
const slackEvents = createEventAdapter('786d090b715da01bffc79e1e7ceaa52e')
const port = process.env.PORT || 3000
const ga = process.env.GA || 'UA-101595764-3'
const app = express()

app.get('/', (req, res) => res.send("i'm alive!"))
app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('message', e => {
    console.log(e)
    let params = {
        ec: 'message',
        ea: `by ${e.user} in ${e.channel} | ${e.thread_ts ? 'is a thread reply' : ''}`,
        el: `message`,
        ev: `${e.text}`
    }
    request.post(`https://www.google-analytics.com/collect?${qs.stringify(params)}`, (error, response, body) => {
        console.info(error)
    })    
    return e
})

slackEvents.on('reaction_added', e => {
    console.log(e)
    let params = {
        ec: 'reaction',
        ea: `by ${e.user} in ${e.channel}`,
        el: `reaction`,
        ev: `${e.reaction} on ${e.item.ts}`
    }
    request.post(`https://www.google-analytics.com/collect?${qs.stringify(params)}`, (error, response, body) => {
        console.info(error)
    })
    return e
})

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))