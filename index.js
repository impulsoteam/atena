const express = require('express')
const { createEventAdapter } = require('@slack/events-api')
const slackEvents = createEventAdapter('786d090b715da01bffc79e1e7ceaa52e')
const port = process.env.PORT || 3000
const app = express()

app.get('/', (req, res) => res.send("i'm alive!"))
app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('message', e => {
    console.log(e)
    return e
})

slackEvents.on('reaction_added', e => {
    console.log(e)
    return e
})

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))