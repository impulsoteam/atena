import { factory } from 'factory-girl'
import faker from 'faker'
import moment from 'moment'

import Message from '../../src/models/Message'
import { providers } from '../../src/models/Message/schema'
import Reaction from '../../src/models/Reaction'
import Score from '../../src/models/Score'
import { scoreTypes } from '../../src/models/Score/schema'
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
      username: faker.internet.userName()
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
      'iron',
      'bronze',
      'silver',
      'gold',
      'diamond'
    ]),
    range: faker.random.arrayElement(['I', 'II', 'III', 'IV', 'V'])
  }
}))

factory.define('User', User, () => ({
  uuid: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  isCoreTeam: false,
  achievements: [],
  score: { value: 0 },
  level: { value: 1 },
  profileCompleteness: {
    personal: 0,
    knowledge: 0,
    professional: 0,
    total: 0
  },
  linkedin: {
    id: faker.internet.password()
  },
  google: {
    id: faker.internet.password()
  }
}))

factory.define('enlistment:user', 'enlistment:user', () => ({
  uuid: faker.random.uuid(),
  fullname: faker.name.findName(),
  email: faker.internet.email(),
  photo_url: faker.image.avatar(),
  github: {
    id: faker.internet.password(),
    username: faker.internet.userName()
  },
  linkedin: {
    uid: faker.internet.password()
  },
  google: {
    uid: faker.internet.password()
  }
}))

export default factory
