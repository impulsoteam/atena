const express = require('express')
const { createEventAdapter } = require('@slack/events-api')
const request = require('request')
const qs = require('querystring')
const slackEvents = createEventAdapter('0e3a482607938ee3971006e0f9768554')
const port = process.env.PORT || 3000
const app = express()

app.get('/', (req, res) => res.send("i'm alive!"))
app.use('/slack/events', slackEvents.expressMiddleware())

const handleEvent = e => {
    console.log(e)
    let params = {
        v: 1,
		tid: process.env.GA || 'UA-101595764-2',
        cid: e.user,
        cd1: e.user,
		cd2: e.channel,
        cd3: e.thread_ts,
        cd4: e.type,
        ds: "slack",
        cs: "slack",
        dh: "https://impulsonetwork.slack.com",
        dp:	`/${e.type==="message" ? e.channel : e.item.channel}`,
		dt:	`Slack Channel: ${e.type==="message" ? e.channel : e.item.channel}`,
		t: 	"event",
        ec: e.type==="message" ? e.channel : e.item.channel,
        ea: `${e.user}`,
        el: e.type==="message" ? `message: ${e.text}` : `reaction: ${e.reaction}`,
        ev: 1
    }
    request.post(`https://www.google-analytics.com/collect?${qs.stringify(params)}`, (error, response, body) => {
        console.info(error)
    })
}

slackEvents.on('message', e => handleEvent(e))

slackEvents.on('reaction_added', e => handleEvent(e))

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))