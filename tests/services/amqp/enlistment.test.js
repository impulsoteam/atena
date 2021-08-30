import faker from 'faker'
import moment from 'moment'

import {
  impulsoPartner,
  partners
} from '../../../src/config/achievements/impulsoPartner'
import { partnerLevels, levels } from '../../../src/config/score'
import RankingController from '../../../src/controllers/RankingController'
import ScoreController from '../../../src/controllers/ScoreController'
import { connect as connectDB } from '../../../src/databases/atena'
import LevelHistory from '../../../src/models/LevelHistory'
import Message from '../../../src/models/Message'
import { providers } from '../../../src/models/Message/schema'
import Reaction from '../../../src/models/Reaction'
import Score from '../../../src/models/Score'
import { scoreTypes } from '../../../src/models/Score/schema'
import User from '../../../src/models/User'
import { connect } from '../../../src/services/amqp'
import factory from '../../mocks/factory'
import { getArray, getAnonymizedEmail } from '../../tools'
import { sendMessage } from '../../tools/amqp'

let connection, channel

beforeAll(async () => {
  connection = await connectDB('test')
  channel = await connect()
  await User.deleteMany({})
  await LevelHistory.deleteMany({})
  await Score.deleteMany({})
})

afterAll(async () => {
  await connection.disconnect()
  await channel.close()
})
describe('handleUser - partner level flow', () => {
  it("should persist partner with no level benefit and don't update level", async () => {
    const invalidPartner = 'invalidPartner'
    const user = await factory.attrs('enlistment:user', {
      referrer: {
        type: 'partner',
        uuid: invalidPartner
      }
    })

    await sendMessage('enlistment.out', 'Impulser', user)

    const persisted = await User.findOne({ uuid: user.uuid })

    expect(persisted.level.value).toBe(1)
    expect(persisted.level.scoreToNextLevel).toBe(levels[0].scoreToNextLevel)
    expect(persisted.level.lastUpdate).toBeFalsy()
    expect(persisted.referrer.identification).toBe(invalidPartner)
    expect(persisted.referrer.type).toBe('partner')

    const levelHistory = await LevelHistory.findOne({
      user: persisted.uuid,
      'details.partner': invalidPartner
    })

    expect(levelHistory).toBeFalsy()
  })
  it('should save persist partner and apply partner level', async () => {
    for (const [partner, level] of Object.entries(partnerLevels)) {
      const user = await factory.attrs('enlistment:user', {
        referrer: {
          type: 'partner',
          uuid: partner
        }
      })

      await sendMessage('enlistment.out', 'Impulser', user)

      const persisted = await User.findOne({ uuid: user.uuid })

      expect(persisted.level.value).toBe(level)
      expect(persisted.level.scoreToNextLevel).toBe(
        levels[level - 1].scoreToNextLevel
      )
      expect(persisted.level.lastUpdate).toBeTruthy()
      expect(persisted.referrer.identification).toBe(partner)
      expect(persisted.referrer.type).toBe('partner')

      const levelHistory = await LevelHistory.findOne({
        user: persisted.uuid,
        'details.partner': partner
      })

      expect(levelHistory).toBeTruthy()
    }
  })

  it('should ignore partner level change if user already have partner level', async () => {
    for (const [partner] of Object.entries(partnerLevels)) {
      const user = await factory.attrs('enlistment:user', {
        referrer: {
          type: 'partner',
          uuid: partner
        }
      })

      await sendMessage('enlistment.out', 'Impulser', user)

      await sendMessage('enlistment.out', 'Impulser', user)

      const levelHistory = await LevelHistory.find({
        user: user.uuid,
        'details.partner': partner
      })

      expect(levelHistory.length).toBe(1)
    }
  })

  it('should ignore level change if new level is less than partner level', async () => {
    const [partner] = Object.entries(partnerLevels)[0]
    const user = await factory.attrs('enlistment:user', {
      referrer: {
        type: 'partner',
        uuid: partner
      }
    })

    await sendMessage('enlistment.out', 'Impulser', user)

    const persisted = await User.findOne({ uuid: user.uuid })

    expect(persisted.score.value).toBe(impulsoPartner(partner).medals[0].score)

    const manualScore = 250
    await ScoreController.handleManualScore({
      user: persisted,
      payload: {
        user: user.uuid,
        score: manualScore,
        description: scoreTypes.manual,
        details: {
          provider: partner
        }
      }
    })

    const updated = await User.findOne({ uuid: user.uuid })

    expect(updated.score.value).toBe(persisted.score.value + manualScore)
    expect(updated.level.value).toBe(persisted.level.value)
  })

  it('should apply level change if new level is grater than partner level', async () => {
    const [partner] = Object.entries(partnerLevels)[0]
    const user = await factory.attrs('enlistment:user', {
      referrer: {
        type: 'partner',
        uuid: partner
      }
    })

    await sendMessage('enlistment.out', 'Impulser', user)

    const persisted = await User.findOne({ uuid: user.uuid })

    expect(persisted.score.value).toBe(impulsoPartner(partner).medals[0].score)

    const manualScore = 10000
    await ScoreController.handleManualScore({
      user: persisted,
      payload: {
        user: user.uuid,
        score: manualScore,
        description: scoreTypes.manual,
        details: {
          provider: partner
        }
      }
    })

    const updated = await User.findOne({ uuid: user.uuid })

    expect(updated.score.value).toBeGreaterThan(10000)
    expect(updated.level.value).toBe(levels[levels.length - 1].level)
  })
})

describe('handleUser - partner achievement flow', () => {
  for (const partner of Object.keys(partners)) {
    it('should save new user with partner and apply partner achievement', async () => {
      const user = await factory.attrs('enlistment:user', {
        referrer: {
          type: 'partner',
          uuid: partner
        }
      })

      await sendMessage('enlistment.out', 'Impulser', user)

      const persisted = await User.findOne({ uuid: user.uuid })

      expect(persisted.achievements[0].name).toBe(partner)

      const achievementScore = await Score.findOne({
        user: user.uuid,
        'details.achievement': partner
      })
      expect(achievementScore).toBeTruthy()
    })
  }
  it('should not update or give points on same partner achievement', async () => {
    const partner = Object.keys(partners)[0]
    const user = await factory.attrs('enlistment:user', {
      referrer: {
        type: 'partner',
        uuid: partner
      }
    })

    await sendMessage('enlistment.out', 'Impulser', user)
    const persisted = await User.findOne({ uuid: user.uuid })

    await sendMessage('enlistment.out', 'Impulser', user)

    const updated = await User.findOne({ uuid: user.uuid })

    expect(updated.score.value).toBe(impulsoPartner(partner).medals[0].score)

    expect(persisted.achievements[0].currentValue).toBe(1)

    expect(persisted.achievements[0].earnedIn).toStrictEqual(
      updated.achievements[0].earnedIn
    )

    const achievementScore = await Score.find({
      user: user.uuid,
      'details.achievement': partner
    })
    expect(achievementScore.length).toBe(1)
  })
})

describe('handleUser - anonymize user', () => {
  it('should anonymized user model and others personal data', async () => {
    const user = await factory.attrs('enlistment:user')
    const userInteractions = 5

    await sendMessage('enlistment.out', 'Impulser', user)

    await User.updateOne({ uuid: user.uuid }, { score: { value: 50 } })
    await RankingController.createGeneralRanking()

    await Promise.all(
      getArray(userInteractions).map(() =>
        factory.create('Score', {
          user: user.uuid
        })
      )
    )
    await RankingController.createMonthlyRanking()

    await Promise.all(
      getArray(userInteractions).map(() =>
        factory.create('Message', {
          user: user.uuid,
          provider: {
            name: faker.random.arrayElement(Object.values(providers)),
            messageId: faker.internet.password(),
            parentId: faker.internet.password(),
            room: {
              id: faker.internet.password(),
              name: faker.lorem.word()
            },
            user: {
              id: faker.internet.password()
            }
          }
        })
      )
    )

    await Promise.all(
      getArray(userInteractions).map(() =>
        factory.create('Reaction', {
          user: user.uuid,
          provider: {
            name: faker.random.arrayElement(Object.values(providers)),
            messageId: faker.internet.password(),
            room: {
              id: faker.internet.password(),
              name: faker.lorem.word()
            }
          }
        })
      )
    )

    const anonymizedEmail = getAnonymizedEmail()
    await sendMessage('enlistment.out', 'Impulser', {
      uuid: user.uuid,
      email: anonymizedEmail,
      anonymized_at: moment().toISOString(),
      github: {
        id: null,
        username: null
      },
      linkedin: {
        uid: null
      },
      google: {
        uid: null
      }
    })

    const persisted = await User.findOne({ uuid: user.uuid })
    expect(persisted.email).toBe(anonymizedEmail)
    expect(persisted.name).toBeFalsy()
    expect(persisted.avatar).toBeFalsy()
    expect(persisted.rocketchat.username).toBeFalsy()
    expect(persisted.github.id).toBeFalsy()
    expect(persisted.github.username).toBeFalsy()
    expect(persisted.linkedin.id).toBeFalsy()
    expect(persisted.google.id).toBeFalsy()

    const messages = await Message.find({
      user: user.uuid,
      'provider.user.username': null
    })
    expect(messages.length).toBe(userInteractions)

    const reactions = await Reaction.find({
      user: user.uuid,
      'provider.username': null
    })

    expect(reactions.length).toBe(userInteractions)

    const monthlyRanking = await RankingController.getMonthlyPositionByUser(
      persisted.uuid
    )
    expect(monthlyRanking.position).toBeFalsy()

    const generalRanking = await RankingController.getGeneralPositionByUser(
      persisted.uuid
    )
    expect(generalRanking.position).toBeFalsy()
  })
})
