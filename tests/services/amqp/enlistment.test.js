import {
  impulsoPartner,
  partners
} from '../../../src/config/achievements/impulsoPartner'
import { partnerLevels, levels } from '../../../src/config/score'
import ScoreController from '../../../src/controllers/ScoreController'
import { connect as connectDB } from '../../../src/databases/atena'
import LevelHistory from '../../../src/models/LevelHistory'
import Score from '../../../src/models/Score'
import { scoreTypes } from '../../../src/models/Score/schema'
import User from '../../../src/models/User'
import { connect } from '../../../src/services/amqp'
import factory from '../../mocks/factory'
import { sendMessage } from '../../tools/amqp'
let connection, channel

beforeAll(async () => {
  connection = await connectDB('test')
  channel = await connect()
  await User.deleteMany({})
  await LevelHistory.deleteMany({})
  await Score.deleteMany({})
}, 10000)

afterAll(async () => {
  await connection.disconnect()
  await channel.close()
}, 5000)
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
