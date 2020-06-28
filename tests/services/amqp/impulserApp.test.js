import { connect as connectDB } from '../../../src/databases/atena'
import Score from '../../../src/models/Score'
import User from '../../../src/models/User'
import { connect } from '../../../src/services/amqp'
import factory from '../../mocks/factory'

const { IMPULSER_APP_EXCHANGE: impulserAppExchange } = process.env

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const sendBunny = async total => {
  const queueOpts = { persistent: false, type: 'profileChange' }
  const payload = Buffer.from(
    JSON.stringify({ uuid: user.uuid, completeness: { total } })
  )
  channel.publish(impulserAppExchange, '', payload, queueOpts)
  await sleep(500)
}

let channel, connectionDB, user

beforeAll(async () => {
  connectionDB = await connectDB('test')
  user = await factory.create('User')

  channel = await connect()
})

afterAll(async () => {
  await User.deleteMany({})
  await Score.deleteMany({})
  await connectionDB.disconnect()

  await channel.close()
})
describe('Should score profile completeness correctly', () => {
  it('Should score fist step of profile completeness', async () => {
    await sendBunny(21)

    const updatedUser = await User.findOne({ uuid: user.uuid })
    const userScore = await Score.find({ user: user.uuid })

    expect(userScore.length).toBe(1)
    expect(updatedUser.score.value).toBe(5)
    expect(updatedUser.profileCompleteness.total).toBe(21)
  })

  it('Should score third step of profile completeness', async () => {
    await sendBunny(62)

    const updatedUser = await User.findOne({ uuid: user.uuid })
    const userScore = await Score.find({ user: user.uuid })

    expect(userScore.length).toBe(3)
    expect(updatedUser.score.value).toBe(30)
    expect(updatedUser.profileCompleteness.total).toBe(62)
  })

  it('Should score last step of profile completeness', async () => {
    await sendBunny(100)

    const updatedUser = await User.findOne({ uuid: user.uuid })
    const userScore = await Score.find({ user: user.uuid })

    expect(userScore.length).toBe(5)
    expect(updatedUser.score.value).toBe(75)
    expect(updatedUser.profileCompleteness.total).toBe(100)
  })

  it('Should decrease profile completeness', async () => {
    await sendBunny(78)

    const updatedUser = await User.findOne({ uuid: user.uuid })
    const userScore = await Score.find({ user: user.uuid })

    expect(userScore.length).toBe(5)
    expect(updatedUser.score.value).toBe(75)
    expect(updatedUser.profileCompleteness.total).toBe(78)
  })

  it('Should increase profile completeness without scoring', async () => {
    await sendBunny(100)

    const updatedUser = await User.findOne({ uuid: user.uuid })
    const userScore = await Score.find({ user: user.uuid })

    expect(userScore.length).toBe(5)
    expect(updatedUser.score.value).toBe(75)
    expect(updatedUser.profileCompleteness.total).toBe(100)
  })
})
