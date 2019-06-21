import errors from '../errors'
import logs from '../logs'
import next from '../next'

const queueIn = process.env.CLOUDMQP_QUEUE
const queueOut = process.env.CLOUDMQP_QUEUE_OUT

const onError = (error, method) => {
  errors._throw('Workers', method, error)
}

const consumer = conn => {
  const on_open = (error, ch) => {
    if (error != null) onError(error, 'consumer')

    ch.assertQueue(queueIn, { durable: true })
    logs.show('[*] Waiting for messages in %s.', queueIn)

    ch.consume(queueIn, async msg => {
      if (msg === null) return
      try {
        const data = msg.content.toString()
        logs.show('[*] Processing message: ', data)
        await next.handleUser(JSON.parse(data))
      } catch (e) {
        onError(e, 'consumer')
      }

      ch.ack(msg)
    })
  }

  conn.createChannel(on_open)
}

const publisher = async (conn, data) => {
  const on_open = async (error, ch) => {
    if (error != null) onError(error, 'publisher')

    const message = new Buffer(JSON.stringify(data))
    await ch.assertExchange(queueOut, 'fanout', { durable: false })

    logs.show(' [x] Sended %s', JSON.stringify(data))
    const queueOpts = { persistent: true }
    await ch.sendToQueue(queueOut, message, queueOpts)
    const sended = await ch.publish(queueOut, '', message, queueOpts)

    if (!sended) onError(sended, 'publisher')

    setTimeout(function() {
      conn.close()
    }, 500)
  }

  return conn.createChannel(on_open)
}

export default {
  onError,
  consumer,
  publisher
}
