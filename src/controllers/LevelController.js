import { sendError } from 'log-on-slack'

import { generateStorytelling } from '../assets/storytelling'
import LevelHistory from '../models/LevelHistory'
import { publishToEnlistment } from '../services/amqp'
import BotController from './BotController'

const providers = []

class LevelController {
  async handle({ user, previousLevel }) {
    try {
      LevelHistory.create({
        user: user.uuid,
        level: {
          previous: previousLevel,
          current: user.level.value
        }
      })
      this.updateBadges(user)
      publishToEnlistment({
        type: 'level_change',
        uuid: user.uuid,
        level: user.level.value
      })

      if (user.level.value > previousLevel && providers.length > 0) {
        for (const { provider } of providers) {
          const username = user[provider] && user[provider].username

          if (!username) continue

          const message = generateStorytelling({
            username,
            level: user.level.value
          })

          BotController.sendMessageToUser({
            provider,
            message,
            username
          })
        }
      }
    } catch (error) {
      sendError({
        file: 'src/controllers/level - handle',
        payload: { user, previousLevel },
        error
      })
    }
  }

  updateBadges(user) {
    for (const { provider, service } of providers) {
      if (user[provider] && user[provider].id)
        service({ id: user[provider].id, level: user.level.value })
    }
  }
}

export default new LevelController()
