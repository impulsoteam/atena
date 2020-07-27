import moment from 'moment'

import { onboardingMessage } from '../assets/onboarding'
import User from '../models/User'
import { sendBatchOfUsersToDrip } from '../services/drip'
import { sleep } from '../utils'
import BotController from './BotController'
import LogController from './LogController'
import RankingController from './RankingController'

class UserController {
  constructor() {
    this.validProviders = ['rocketchat']
  }

  async handle(payload) {
    try {
      const { newUser, user } = await User.createOrUpdate(payload)

      if (newUser) {
        for (const provider of this.validProviders) {
          if (user[provider])
            BotController.sendMessageToUser({
              provider,
              message: onboardingMessage,
              username: user[provider].username
            })
        }
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async delete(payload) {
    try {
      const result = await User.deleteUserData(payload.uuid)

      if (result.notFound) return
      LogController.sendNotify({
        file: 'controllers/UserController.delete',
        resume: 'User data removed',
        details: {
          uuid: payload.uuid,
          email: payload.email,
          result
        }
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async getProfile(uuid) {
    const user = await User.findOne({ uuid })

    if (!user) throw new Error(`Unable to find ${uuid}`)
    const general = await RankingController.getGeneralPositionByUser(uuid)
    const monthly = await RankingController.getMonthlyPositionByUser(uuid)

    return {
      user,
      rankings: { general, monthly }
    }
  }

  async sendUsersToDrip() {
    try {
      const totalUsers = await User.countDocuments({})
      const { ranking: monthly } = await RankingController.getMonthlyRanking({
        offset: 0,
        size: totalUsers
      })

      const { ranking: general } = await RankingController.getGeneralRanking({
        offset: 0,
        size: totalUsers
      })

      let subscribers = []
      const sendBatch = async () => {
        await sleep(5000)
        sendBatchOfUsersToDrip(subscribers)
        subscribers = []
      }

      for (const [position, user] of Object.entries(monthly)) {
        const { email, score, level, achievements } = await User.findOne({
          uuid: user.uuid
        })

        const customFields = {
          atena_level: level.value,
          score_to_next_level: level.scoreToNextLevel,
          number_of_achievements: achievements.length,
          ranking_monthly_position: parseInt(position) + 1,
          ranking_monthly_score: user.score,
          ranking_general_position:
            general.findIndex(({ uuid }) => uuid === user.uuid) + 1,
          ranking_general_score: score.value,
          atena_updated_at: moment().toDate()
        }

        if (achievements.length) {
          const { name, medal, range } = achievements.sort(
            (a, b) => b.earnedIn - a.earnedIn
          )[0]
          customFields.last_achievements = `${name} - ${medal} - ${range}`
        }

        subscribers.push({
          email: email,
          custom_fields: customFields
        })

        if (subscribers.length === 999) await sendBatch()
      }

      await sendBatch()

      LogController.sendNotify({
        file: 'controllers/UserController.sendUsersToDrip',
        resume: 'Job done!',
        details: { usersUpdated: monthly.length }
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }
}

export default new UserController()
