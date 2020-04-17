import User from '../models/User'
import LogController from './LogController'
import BotController from './BotController'
import { onboardingMessage } from '../assets/onboarding'

class UserController {
  constructor() {
    this.validProviders = ['rocketchat']
  }

  async create(payload) {
    try {
      await User.create(payload)
    } catch (error) {
      console.log(error)
    }
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
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/UserController.handle',
        resume: 'Unexpected error',
        details: error
      })
    }
  }

  async delete(payload) {
    try {
      console.log(payload)
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/UserController.delete',
        resume: 'Unexpected error',
        details: error
      })
    }
  }
}

export default new UserController()
