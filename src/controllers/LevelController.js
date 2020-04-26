import { generateStorytelling } from '../assets/storytelling'
import LevelHistory from '../models/LevelHistory'
import { publish } from '../services/amqp'
import { updateBadge as updateRocketchatBadge } from '../services/rocketchat/api'
import BotController from './BotController'
import LogController from './LogController'

const providers = [
  { provider: 'rocketchat', service: payload => updateRocketchatBadge(payload) }
]

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
      publish({
        type: 'level_change',
        uuid: user.uuid,
        level: user.level.value
      })

      if (user.level.value > previousLevel) {
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
      LogController.sendError(error)
    }
  }

  updateBadges(user) {
    for (const { name, service } of providers) {
      if (user[name] && user[name].id)
        service({ id: user[name].id, level: user.level.value })
    }
  }
}

export default new LevelController()
