import errors from '../errors'
import logs from '../logs'
import next from '../next'

const queueIn = process.env.CLOUDMQP_QUEUE
const queueOut = process.env.CLOUDMQP_QUEUE_OUT

const onError = (error, method) => {
  errors._throw('Workers', method, error)
}

const consumer = conn => {
  const onCreate = (error, ch) => {
    if (error != null) onError(error, 'consumer')

    ch.assertQueue(queueIn, { durable: true })
    logs.info('[*] Waiting for messages in %s.', queueIn)

    ch.consume(queueIn, async msg => {
      if (msg === null) return
      try {
        const data = msg.content.toString()
        logs.info('[*] Processing message: ', data)
        await next.handleUser(JSON.parse(data))
        logs.info('[*] Processed message: ', data)
      } catch (e) {
        onError(e, 'consumer')
      }

      ch.ack(msg)
    })
  }

  conn.createChannel(onCreate)
}

const publisher = async (conn, data) => {
  const onCreate = async (error, ch) => {
    if (error != null) onError(error, 'publisher')

    const message = new Buffer(JSON.stringify(data))
    await ch.assertExchange(queueOut, 'fanout', { durable: false })

    logs.info(' [*] Sending %s', JSON.stringify(data))
    const queueOpts = { persistent: false }
    await ch.sendToQueue(queueOut, message, queueOpts)
    const sended = await ch.publish(queueOut, '', message, queueOpts)

    if (sended) logs.info(' [*] Sended %s', JSON.stringify(data))
    else onError(sended, 'publisher')
  }

  conn.createChannel(onCreate)

  setTimeout(function() {
    conn.close()
  }, 500)
}

export default {
  onError,
  consumer,
  publisher
}
