import { factory } from 'factory-girl'
import faker from 'faker'
import moment from 'moment'

import Message, { providers } from '../../src/models/Message'
import Reaction from '../../src/models/Reaction'
import Score, { scoreTypes } from '../../src/models/Score'
import User from '../../src/models/User'

factory.define('Message', Message, () => ({
  user: faker.random.uuid(),
  content: faker.lorem.sentence(),
  threadCount: faker.random.arrayElement([0, 1, 0]),
  reactionCount: faker.random.arrayElement([0, 1, 0]),
  provider: {
    name: faker.random.arrayElement(Object.values(providers)),
    messageId: faker.internet.password(),
    parentId: faker.internet.password(),
    room: {
      id: faker.internet.password(),
      name: faker.lorem.word()
    },
    user: {
      id: faker.internet.password(),
      username: faker.internet.userName(),
      name: faker.name.findName()
    }
  },
  createdAt: faker.date.past(2),
  updatedAt: moment().toDate()
}))
factory.define('Reaction', Reaction, () => ({
  user: faker.random.uuid(),
  content: faker.lorem.sentence(),
  provider: {
    name: faker.random.arrayElement(Object.values(providers)),
    messageId: faker.internet.password(),
    username: faker.internet.userName(),
    room: {
      id: faker.internet.password(),
      name: faker.lorem.word()
    }
  }
}))
factory.define('Score', Score, () => ({
  user: faker.random.uuid(),
  score: faker.random.arrayElement([3, 5, 7]),
  description: faker.random.arrayElement(Object.values(scoreTypes)),
  details: {
    provider: faker.random.arrayElement(Object.values(providers)),
    messageId: faker.internet.password(),
    room: faker.internet.password(),
    achievement: faker.random.arrayElement(Object.values(scoreTypes)),
    medal: faker.random.arrayElement([
      'bronze',
      'silver',
      'gold',
      'platinum',
      'diamond'
    ]),
    range: faker.random.arrayElement(['I', 'II', 'III', 'IV', 'V'])
  }
}))
factory.define('User', User, () => ({
  uuid: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  isCoreTeam: false,
  achievements: [],
  rocketchat: {
    id: faker.internet.password(),
    name: faker.name.findName(),
    username: faker.internet.userName()
  },
  linkedin: {
    id: faker.internet.password()
  },
  google: {
    id: faker.internet.password()
  },
  pro: {
    isPro: true,
    beginAt: faker.date.past(),
    finishAt: faker.date.future()
  }
}))
factory.define('messagePayload', 'messagePayload', () => ({
  content: faker.lorem.sentence(),
  threadCount: faker.random.arrayElement([0, 1, 0]),
  reactionCount: faker.random.arrayElement([0, 1, 0]),
  reactions: [],
  createdAt: faker.date.past(2),
  updatedAt: moment().toDate(),
  previousMessage: {
    user: faker.internet.password(),
    createdAt: faker.date.past(2)
  },
  provider: {
    name: faker.random.arrayElement(Object.values(providers)),
    messageId: faker.internet.password(),
    parentId: faker.internet.password(),
    room: {
      id: faker.internet.password(),
      name: faker.lorem.word()
    },
    user: {
      id: faker.internet.password(),
      username: faker.internet.userName(),
      name: faker.name.findName()
    }
  }
}))

factory.define('reactionPayload', 'reactionPayload', () => ({
  content: faker.lorem.word(),
  provider: {
    name: faker.random.arrayElement(Object.values(providers)),
    messageId: faker.internet.password(),
    room: {
      id: faker.internet.password(),
      name: faker.lorem.word()
    },
    username: faker.internet.userName()
  }
}))

export default factory
