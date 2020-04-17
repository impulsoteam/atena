import { Connection } from 'amqplib-as-promised'
import chalk from 'chalk'
import LogController from '../../controllers/LogController'
import { handlePayload } from './handler'

const { CLOUDAMQP_URL } = process.env

let channel

export const connect = async () => {
  const queues = ['atena.in']
  try {
    const connection = new Connection(CLOUDAMQP_URL)
    await connection.init()
    channel = await connection.createChannel()

    for (const queue of queues) {
      await channel.assertQueue(queue, { durable: true })
      console.log(`${chalk.green('✓')} [*] ${queue} successfully asserted`)

      await channel.consume(
        queue,
        msg => {
          const { properties, content } = msg
          const data = JSON.parse(content.toString())
          handlePayload({ data, properties })
          // todo wtf is this?
          // channel.ack(msg)
        },
        { noAck: true }
      )
      console.log('%s [*] Awaiting messages on', chalk.green('✓'), queue)
    }
  } catch (error) {
    return LogController.sendNotify({
      type: 'error',
      file: 'nextApp/index.js - connect',
      resume: 'Error while connecting in amqp',
      details: error
    })
  }
}

// export const publish = async payload => {
//   const queue = 'atena.out'
//   const message = Buffer.from(JSON.stringify(payload))
//   try {
//     await channel.sendToQueue(queue, message, {})
//   } catch (error) {
//     LogController.sendNotify({
//       type: 'error',
//       file: 'nextApp/index.js - publish',
//       resume: `Error while publishing message in ${queue}`,
//       details: error
//     })
//   }
// }

export const publish = async payload => {
  console.log(payload)
  // const queue = 'atena.out'
  // const message = Buffer.from(JSON.stringify(payload))
  // const options = { persistent: false }
  // try {
  //   await channel.assertExchange(queue, 'fanout', { durable: false })
  //   await channel.sendToQueue(queue, message, options)
  //   await channel.publish(queue, '', message, options)
  // } catch (error) {
  //   LogController.sendNotify({
  //     type: 'error',
  //     file: 'nextApp/index.js - publish',
  //     resume: `Error while publishing message in ${queue}`,
  //     details: error
  //   })
  // }
}
