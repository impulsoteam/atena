import factory from './mocks/factory'
import faker from 'faker'
import Message, { providers } from '../src/models/Message'
import Reaction from '../src/models/Reaction'
import Score from '../src/models/Score'
import User from '../src/models/User'
import { connect } from './utils'

import MessageController from '../src/controllers/MessageController'

let connection, user
beforeAll(async () => {
  connection = await connect('atenaTest')
  await Message.deleteMany({})
  await Reaction.deleteMany({})
  await Score.deleteMany({})
  await User.deleteMany({})
  user = await factory.create('User')
})

afterAll(async () => {
  await connection.disconnect()
})

describe('new message', () => {
  it('should save message and update score', async () => {
    console.log(user)
    const payload = await factory.attrs('messagePayload', {
      provider: {
        name: faker.random.arrayElement(Object.values(providers)),
        messageId: faker.internet.password(),
        parentId: faker.internet.password(),
        room: {
          id: faker.internet.password(),
          name: faker.lorem.word()
        },
        user: {
          id: user.rocketchat.id,
          name: user.rocketchat.name,
          username: user.rocketchat.username
        }
      }
    })
    console.log(payload)
    await MessageController.handle(payload)
    const { achievements } = User.findOne({ uuid: user.uuid })
    const message = Message.findOne({
      'provider.messageId': payload.provider.messageId
    })
    const score = Score.findOne({
      user: user.uuid,
      'details.messageId': payload.provider.messageId
    })

    expect(message).toBeTruthy()
    expect(score).toBeTruthy()
    expect(achievements.length).toBe(2)
  })
})
