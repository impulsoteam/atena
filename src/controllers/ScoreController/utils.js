import moment from 'moment'

import { scoreRules, levels, partnerLevels } from '../../config/score'
import Score from '../../models/Score'
import { scoreTypes } from '../../models/Score/schema'
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

  async reactionSendedCannotScore({ reaction, payload }) {
    const isSameUser =
      payload.provider.user.username === reaction.provider.username

    const alreadyReactOnMessage = await Score.findOne({
      description: scoreTypes.reactionSended,
      'details.messageId': reaction.provider.messageId,
      user: reaction.user
    })

    return isSameUser || !!alreadyReactOnMessage
  }

  async reactionReceivedCannotScore({ receiver, reaction, payload }) {
    const isSameUser =
      payload.provider.user.username === reaction.provider.username

    const alreadyScoreOnReaction = await Score.findOne({
      description: scoreTypes.reactionReceived,
      'details.messageId': reaction.provider.messageId,
      'details.sender': reaction.user,
      user: receiver.uuid
    })

    return isSameUser || !!alreadyScoreOnReaction
  }

  async reactionSendedCannotAchieve({ reaction }) {
    const cannotAchieve = await Score.findOne({
      description: scoreTypes.reactionRemoved,
      user: reaction.user,
      'details.messageId': reaction.provider.messageId
    })

    return !!cannotAchieve
  }

  async reactionReceiveCannotAchieve({ uuid, reaction }) {
    const cannotAchieve = await Score.findOne({
      description: scoreTypes.reactionRemoved,
      user: uuid,
      'details.messageId': reaction.provider.messageId
    })

    return !!cannotAchieve
  }

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
    const medals = ['Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante']

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
