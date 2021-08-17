import { sendError, sendNotify } from 'log-on-slack'

import { achievementTypes } from '../config/achievements'
import Message from '../models/Message'
import User from '../models/User'
import AchievementController from './AchievementController'
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
          achievementType: achievementTypes.messageSended,
          provider: payload.provider.name
        })
      }
    } catch (error) {
      sendError({
        file: 'src/controllers/message - handle',
        payload,
        error
      })
    }
  }

  async saveUnownedMessage(payload) {
    try {
      await Message.create(payload)

      sendNotify({
        file: 'MessageController.saveUnownedMessage',
        resume: 'Unable to find user.',
        details: payload
      })
    } catch (error) {
      sendError({
        file: 'src/controllers/message - saveUnownedMessage',
        payload,
        error
      })
    }
  }

  async anonymize(uuid) {
    try {
      const messages = await Message.find({ user: uuid })

      for (const message of messages) {
        message.provider.user.username = null
        await message.save()
      }
    } catch (error) {
      sendError({
        file: 'MessageController.anonymize',
        payload: uuid,
        error
      })
    }
  }
}

export default new MessageController()
