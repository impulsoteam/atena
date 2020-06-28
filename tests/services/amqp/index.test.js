import { connect, publishToEnlistment } from '../../../src/services/amqp'
import * as enlistmentHandler from '../../../src/services/amqp/enlistment'
import * as impulserAppHandler from '../../../src/services/amqp/impulserApp'

const {
  ENLISTMENT_EXCHANGE: enlistmentExchange,
  IMPULSER_APP_EXCHANGE: impulserAppExchange
} = process.env

const spyEnlistmentHandler = jest.spyOn(enlistmentHandler, 'handle')
const spyImpulserAppHandler = jest.spyOn(impulserAppHandler, 'handle')

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let channel
beforeAll(async () => {
  channel = await connect()
})

afterAll(async () => {
  await sleep(500)
  await channel.close()
})
describe('Should be ready to publish and receive messages', () => {
  it('Should connect to enlistment exchange and successfully receive a message', async () => {
    const payload = Buffer.from(
      JSON.stringify({ message: 'Hello from enlistment' })
    )

    await channel.publish(enlistmentExchange, '', payload, {})

    await sleep(500)
    expect(spyEnlistmentHandler).toHaveBeenCalled()
  })

  it('Should connect to impulserApp exchange and successfully receive a message', async () => {
    const payload = Buffer.from(
      JSON.stringify({ message: 'Hello from impulserApp' })
    )

    await channel.publish(impulserAppExchange, '', payload, {})
    await sleep(500)

    expect(spyImpulserAppHandler).toHaveBeenCalled()
  })

  it('Should successfully send a message to enlistment', async () => {
    const queue = 'test.fromAtena.toEnlistment'
    const message = 'Hello from atena'

    await channel.assertQueue(queue, { durable: false })
    await channel.bindQueue(queue, enlistmentExchange)

    await publishToEnlistment({ message, type: queue })

    await sleep(500)
    channel.consume(queue, msg => {
      const { content, properties } = msg
      const data = JSON.parse(content.toString())
      expect(data.message).toBe(message)
      expect(properties.type).toBe(queue)
      channel.ack(msg)
    })
    await sleep(500)
  })
})
