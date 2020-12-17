import { Connection } from 'amqplib-as-promised'

import { sleep } from './index'

export const createExchange = async exchange => {
  const connection = new Connection(process.env.AMQP_URL)
  await connection.init()
  const channel = await connection.createChannel()
  await channel.assertExchange(exchange, 'fanout', {
    durable: false
  })

  return channel
}

export const sendMessage = async (exchange, type, message) => {
  const channel = await createExchange(exchange)
  channel.publish(exchange, '', Buffer.from(JSON.stringify(message)), {
    type
  })
  await sleep(500)
  return message
}
