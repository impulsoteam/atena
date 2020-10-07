import { Connection } from 'amqplib-as-promised'
import chalk from 'chalk'
import { sendError } from 'log-on-slack'

import { handle as handleEnlistmentPayload } from './enlistment'
import { handle as handleImpulserAppPayload } from './impulserApp'
import { handle as handleMinerPayload } from './miner'

const { AMQP_URL: amqpUrl, ATENA_EXCHANGE: atenaExchange } = process.env

let channel

export const connect = async () => {
  try {
    const connection = new Connection(amqpUrl)
    await connection.init()
    channel = await connection.createChannel()
    channel.prefetch(1)
    await channel.assertExchange(atenaExchange, 'fanout', { durable: false })
    console.log(
      '%s [*] Ready to publish messages on',
      chalk.green('✓'),
      atenaExchange
    )

    await connectToMiner()
    await connectToEnlistment()
    await connectToImpulserApp()

    return channel
  } catch (error) {
    sendError({
      file: 'services/amqp/index.js - connect',
      error
    })
    process.exit(1)
  }
}

const connectToEnlistment = async () => {
  const {
    ENLISTMENT_EXCHANGE: enlistmentExchange,
    QUEUE_FOR_ENLISTMENT: queueForEnlistment
  } = process.env

  await channel.assertExchange(enlistmentExchange, 'fanout', { durable: false })

  await channel.assertQueue(queueForEnlistment, { durable: true })

  await channel.bindQueue(queueForEnlistment, enlistmentExchange)

  channel.consume(queueForEnlistment, message =>
    handleEnlistmentPayload({ message, channel })
  )

  console.log(
    '%s [*] Awaiting messages on',
    chalk.green('✓'),
    queueForEnlistment
  )
}

const connectToImpulserApp = async () => {
  const {
    IMPULSER_APP_EXCHANGE: impulserAppExchange,
    QUEUE_FOR_IMPULSER_APP: queueForImpulserApp
  } = process.env

  await channel.assertExchange(impulserAppExchange, 'fanout', {
    durable: false
  })

  await channel.assertQueue(queueForImpulserApp, { durable: true })

  await channel.bindQueue(queueForImpulserApp, impulserAppExchange)

  channel.consume(queueForImpulserApp, message =>
    handleImpulserAppPayload({ message, channel })
  )
  console.log(
    '%s [*] Awaiting messages on',
    chalk.green('✓'),
    queueForImpulserApp
  )
}

const connectToMiner = async () => {
  try {
    const {
      MINER_EXCHANGE: minerExchange,
      QUEUE_FOR_MINER: queueForMiner
    } = process.env

    await channel.assertExchange(minerExchange, 'fanout', {
      durable: false
    })

    await channel.assertQueue(queueForMiner, { durable: true })

    await channel.bindQueue(queueForMiner, minerExchange)

    channel.consume(queueForMiner, message =>
      handleMinerPayload({ message, channel })
    )
    console.log('%s [*] Awaiting messages on', chalk.green('✓'), queueForMiner)
  } catch (error) {
    console.log(error)
  }
}

export const publishToEnlistment = async payload => {
  const queueOpts = { persistent: false, type: payload.type }
  const message = Buffer.from(JSON.stringify(payload))
  try {
    await channel.publish(atenaExchange, '', message, queueOpts)
  } catch (error) {
    sendError({
      file: 'services/amqp/index.js - publishToEnlistment',
      payload,
      error
    })
  }
}
