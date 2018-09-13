const express = require('express')
const { createEventAdapter } = require('@slack/events-api')
const ua = require('universal-analytics')
const slackEvents = createEventAdapter('786d090b715da01bffc79e1e7ceaa52e')
const port = process.env.PORT || 3000
const app = express()
const visitor = ua('UA-101595764-3')

// app.get('/', (req, res) => res.send("i'm alive!"))
app.get('/', ((req, res) => {
    const params = {
        uid: 'teste',
        cd: 'nome do evento (reação ou mensagem)',
        dp: 'nome do canal',
        ea: 'nome do evento (reacao ou mensagem)',
        ec: 'mensagem no canal ou numa thread',
        el: 'conteudo',
        ev: 'texto ou reação'
    }

    visitor.event(params).send()

    res.send('dsdsds')
}))
app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('message', e => {
    console.log(e)
    let params = {
        ec: 'message',
        ea: `by ${e.user} in ${e.channel} | ${e.thread_ts ? 'is a thread reply' : ''}`,
        el: `message`,
        ev: `${e.text}`
    }
    visitor.event(params).send(r => console.info(r))
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
    visitor.event(params).send(r => console.info(r))
    return e
})

slackEvents.on('error', console.error)

app.listen(port, () => console.info(`Listening on port ${port}`))