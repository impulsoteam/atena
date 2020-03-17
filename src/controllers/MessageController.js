import Message from '../models/Message'
import User from '../models/User'
import LogController from './LogController'
import ScoreController from './ScoreController'
import AchievementController from './AchievementController'

class MessageController {
  async handle(payload) {
    try {
      const { provider } = payload
      const user = await User.findOne({
        [`${provider.name}.id`]: provider.user.id
      })

      if (!user) return this.saveUnownedMessage(payload)
      console.log(payload)
      const message = await Message.createOrUpdate(
        {
          'provider.messageId': provider.messageId
        },
        payload
      )

      if (message.__v === 1) {
        const updatedUser = await ScoreController.handleMessage({
          payload,
          message,
          user
        })
        await AchievementController.messageSended({
          user: updatedUser,
          message
        })
      }
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/MessageController.handle',
        resume: 'Unexpected error in MessageController.handle',
        details: error
      })
    }
  }

  async saveUnownedMessage(payload) {
    try {
      const { content, provider } = payload

      await Message.findOneAndUpdate(
        { 'provider.messageId': provider.messageId },
        payload
      )

      LogController.sendNotify({
        file: 'controllers/MessageController.saveUnownedMessage',
        resume: `Unable to find user.`,
        details: {
          content,
          provider
        }
      })
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/MessageController',
        resume: 'Unexpected error in MessageController.saveUnownedMessage',
        details: error
      })
    }
  }
}

export default new MessageController()
