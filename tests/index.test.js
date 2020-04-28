import faker from 'faker'

import MessageController from '../src/controllers/MessageController'
import Message, { providers } from '../src/models/Message'
import Reaction from '../src/models/Reaction'
import Score from '../src/models/Score'
import User from '../src/models/User'
import './utils'
import factory from './mocks/factory'

let user
beforeAll(async () => {
  await Message.deleteMany({})
  await Reaction.deleteMany({})
  await Score.deleteMany({})
  await User.deleteMany({})
  user = await factory.create('User')
})

afterAll(async () => {})

describe('new message', () => {
  it('should save message, update score and achievement', async () => {
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
    await MessageController.handle(payload)
    const { achievements } = await User.findOne({ uuid: user.uuid })
    const message = await Message.findOne({
      'provider.messageId': payload.provider.messageId
    })
    const score = await Score.findOne({
      user: user.uuid,
      'details.messageId': payload.provider.messageId
    })

    expect(message).toBeTruthy()
    expect(score).toBeTruthy()
    expect(achievements.length).toBe(1)
  })
})
