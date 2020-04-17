import LogController from './LogController'
import LevelHistory from '../models/LevelHistory'
import { updateBadge as updateRocketchatBadge } from '../services/rocketchat/api'
import { publish } from '../services/amqp'

const providers = [
  { name: 'rocketchat', service: payload => updateRocketchatBadge(payload) }
]

class LevelController {
  async handle({ user, previousLevel }) {
    try {
      LevelHistory.create({
        uuid: user.uuid,
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
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/LevelController.store',
        resume: 'Unexpected error',
        details: error
      })
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
