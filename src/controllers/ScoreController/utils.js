import moment from 'moment'

import { scoreRules, levels } from '../../config/score'
import Score from '../../models/Score'
import User from '../../models/User'
import LevelController from '../LevelController'

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

  async checkReactionSended({ sender, reaction, payload }) {
    const isSameUser =
      payload.provider.user.username === reaction.provider.username

    const scoreOfTheDay = await Score.getDailyScore(sender.uuid)

    const canScore = scoreOfTheDay < scoreRules.dailyLimit

    return { canScore, isSameUser }
  }

  checkReactionReceived({ payload, reaction }) {
    return payload.provider.user.username === reaction.provider.username
  }

  async updateUserScore({ user, scoreEarned }) {
    const score = {
      value: user.score.value + scoreEarned,
      lastUpdate: moment()
    }

    const currentLevel = levels.find(({ currentRange }) => {
      if (!currentRange.max) return true
      return currentRange.min <= score.value && currentRange.max >= score.value
    })

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
