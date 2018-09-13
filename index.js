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
        v: 1,
		tid: ga,
        cid: e.user,
        cd1: e.user,
		cd2: e.channel,
        cd3: '',
        cd4: e.reaction,
        ds: "slack",
        cs: "slack",
        dh: "https://temdelivery.slack.com",
        dp:	`/${e.channel}`,
		dt:	`Slack Channel: ${e.channel}`,
		t: 	"event",
        ec: `message in ${e.channel} >> ${e.item.ts}`,
        ea: `by ${e.user} in ${e.item.channel} | ${e.thread_ts ? 'is a thread reply' : ''}`,
        el: e.text,
        ev: 1
    }
    request.post(`https://www.google-analytics.com/collect?${qs.stringify(params)}`, (error, response, body) => {
        console.info(error)
    })    
    return e
})

slackEvents.on('reaction_added', e => {
    console.log(e)
    let params = {
        v: 1,
		tid: ga,
        cid: e.user,
        cd1: e.user,
		cd2: e.channel,
        cd3: '',
        cd4: e.reaction,
        ds: "slack",
        cs: "slack",
        dh: "https://temdelivery.slack.com",
        dp:	`/${e.channel}`,
		dt:	`Slack Channel: ${e.channel}`,
		t: 	"event",
        ec: 'reaction',
        ea: `by ${e.user} in ${e.channel}`,
        el: e.reaction,
        ev: 1
    }
    request.post(`https://www.google-analytics.com/collect?${qs.stringify(params)}`, (error, response, body) => {
        console.info(error)
    })
    return e
})

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))