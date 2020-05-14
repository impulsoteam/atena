import Message from '../models/Message'
import User from '../models/User'
import AchievementController from './AchievementController'
import LogController from './LogController'
import ScoreController from './ScoreController'

class MessageController {
  async handle(payload) {
    try {
      const { provider } = payload
      const user = await User.findOne({
        [`${provider.name}.id`]: provider.user.id
      })

      if (!user) return this.saveUnownedMessage(payload)

      const message = await Message.createOrUpdate(
        {
          'provider.messageId': provider.messageId
        },
        { user: user.uuid, ...payload }
      )

      if (message.__v === 1) {
        const updatedUser = await ScoreController.handleMessage({
          payload,
          message,
          user
        })

        await AchievementController.handle({
          user: updatedUser,
          achievementType: 'messageSended',
          provider: payload.provider.name
        })
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async saveUnownedMessage(payload) {
    try {
      const { content, provider } = payload

      await Message.create(payload)

      LogController.sendError({
        file: 'MessageController.saveUnownedMessage',
        resume: `Unable to find user.`,
        details: {
          content,
          provider
        }
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }
}

export default new MessageController()
