import { sendError } from 'log-on-slack'

import { partners } from '../../config/achievements/impulsoPartner'
import { partnerLevels, levels } from '../../config/score'
import LevelHistory from '../../models/LevelHistory'
import AchievementController from '../AchievementController'

export default class {
  async handleUserPartner(user) {
    try {
      if (Object.keys(partnerLevels).includes(user.referrer.identification)) {
        const partnerLevelAlreadyGiven = await LevelHistory.findOne({
          user: user.uuid,
          'details.partner': user.referrer.identification
        })

        if (partnerLevelAlreadyGiven) return
        const oldLevel = user.level.value
        const partnerLevel = partnerLevels[user.referrer.identification]

        user.level = {
          value: partnerLevel,
          scoreToNextLevel: levels[partnerLevel - 1].scoreToNextLevel,
          lastUpdate: new Date()
        }

        await user.save()
        await LevelHistory.create({
          user: user.uuid,
          level: {
            previous: oldLevel,
            current: partnerLevel
          },
          details: { partner: user.referrer.identification }
        })
      }

      if (Object.keys(partners).includes(user.referrer.identification)) {
        const partnerAchievementAlreadyGiven = user.achievements.find(
          ({ name }) => name === user.referrer.identification
        )

        if (partnerAchievementAlreadyGiven) return
        const achievementType = user.referrer.identification
        AchievementController.handle({
          user,
          achievementType,
          provider: achievementType
        })
      }
    } catch (error) {
      sendError({
        file: 'controllers/UserController/utils.js',
        payload: user,
        error
      })
    }
  }
}
