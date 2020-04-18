import User from '../models/User'
import LogController from './LogController'
import BotController from './BotController'
import { onboardingMessage } from '../assets/onboarding'

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
        resume: `User data removed`,
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
}

export default new UserController()
