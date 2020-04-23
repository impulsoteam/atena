import moment from 'moment'
import { scoreRules, levels } from '../../config/score'
import LevelController from '../LevelController'
import Score from '../../models/Score'
import User from '../../models/User'

export default class ScoreUtils {
  async messageCannotScore({ payload, message }) {
    const isSameUser = payload.previousMessage.user === message.provider.user.id
    const isFlood =
      moment().diff(payload.previousMessage.createdAt, 'seconds') <=
      scoreRules.flood
    if (isSameUser && isFlood) return true

    const scoreOfTheDay = await Score.getDailyScore(message.user)

    return scoreOfTheDay >= scoreRules.dailyLimit
  }

  async updateUserScore({ user, scoreEarned }) {
    const score = {
      value: user.score.value + scoreEarned,
      lastUpdate: moment()
    }

    const currentLevel = levels.find(
      ({ currentRange }) =>
        currentRange.min <= score.value && currentRange.max >= score.value
    )

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
}
