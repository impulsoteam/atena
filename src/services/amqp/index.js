import { Connection } from 'amqplib-as-promised'
import chalk from 'chalk'

import LogController from '../../controllers/LogController'
import { handlePayload } from './handler'

const {
  AMQP_URL: amqpUrl,
  QUEUE_IN: queueIn,
  QUEUE_OUT: queueOut
} = process.env

let channel

export const connect = async () => {
  try {
    const connection = new Connection(amqpUrl)
    await connection.init()
    channel = await connection.createChannel()

    await channel.assertExchange(queueOut, 'fanout', { durable: false })
    console.log(`${chalk.green('✓')} [*] ${queueOut} successfully exchanged`)

    await channel.assertQueue(queueIn, { durable: true })
    console.log(`${chalk.green('✓')} [*] ${queueIn} successfully asserted`)

    await channel.consume(
      queueIn,
      msg => {
        const { properties, content } = msg

        const data = JSON.parse(content.toString())
        handlePayload({ data, properties })
      },
      { noAck: true }
    )
    console.log('%s [*] Awaiting messages on', chalk.green('✓'), queueIn)
  } catch (error) {
    LogController.sendError(error)
    process.exit(1)
  }
}

export const publish = async payload => {
  const message = Buffer.from(JSON.stringify(payload))
  try {
    await channel.sendToQueue(queueOut, message, {})
  } catch (error) {
    LogController.sendError(error)
  }
}
