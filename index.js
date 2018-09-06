const express = require('express')
const { createEventAdapter } = require('@slack/events-api')
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send("i'm alive!")
})

app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('message', e => {
    console.log(e)
    // console.log(`Received a message event: user ${e.user} in channel ${e.channel} says ${e.text}`)
})

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))