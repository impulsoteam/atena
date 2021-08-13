import moment from 'moment'

import { levels, partnerLevels } from '../../config/score'
import User from '../../models/User'
import LevelController from '../LevelController'

export default class ScoreUtils {
  async updateUserScore({ user, scoreEarned }) {
    const score = {
      value: user.score.value + scoreEarned,
      lastUpdate: moment()
    }

    let currentLevel

    if (Object.keys(partnerLevels).includes(user.referrer.identification)) {
      const partnerLevel =
        levels[partnerLevels[user.referrer.identification] - 1]

      if (score.value <= partnerLevel.currentRange.max) {
        currentLevel = partnerLevel
      }
    }

    if (!currentLevel) {
      currentLevel = levels.find(({ currentRange }) => {
        if (!currentRange.max) return true
        return (
          currentRange.min <= score.value && currentRange.max >= score.value
        )
      })
    }

    const level =
      currentLevel.level !== user.level.value
        ? {
            value: currentLevel.level,
            scoreToNextLevel: currentLevel.scoreToNextLevel,
            lastUpdate: moment()
          }
        : user.level

    const updatedUser = await User.updateScore({
      uuid: user.uuid,
      score,
      level
    })

    if (level.value !== user.level.value) {
      LevelController.handle({
        user: updatedUser,
        previousLevel: user.level.value
      })
    }

    return updatedUser
  }

  getProfileCompletenessMessage(progress) {
    const medals = ['Ferro', 'Bronze', 'Prata', 'Ouro', 'Diamante']

    const ranges = [20, 40, 60, 80, 100]

    let medal

    for (const [index, range] of ranges.entries()) {
      if (progress < 20) {
        medal = medals[0]
        break
      } else if (!ranges[index + 1]) {
        medal = medals[4]
        break
      } else if (progress >= range && progress < ranges[index + 1]) {
        medal = medals[index]
        break
      }
    }

    return `🏅 Você obteve a conquista [Completude de perfil | ${medal}]!`
  }
}
