import { sendError } from 'log-on-slack'

import LevelHistory from '../models/LevelHistory'
import { publishToEnlistment } from '../services/amqp'

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

      if (user.level.value > previousLevel) {
        for (const { provider } of providers) {
          const username = user[provider] && user[provider].username

          if (!username) continue
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
