import { onboardingMessage } from '../assets/onboarding'
import User from '../models/User'
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
}

export default new UserController()
