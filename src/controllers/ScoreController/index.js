import LogController from '../LogController'
import User from '../../models/User'
import Score, { scoreTypes } from '../../models/Score'
import { scoreRules } from '../../config/score'
import ScoreUtils from './utils'
import moment from 'moment'

class ScoreController extends ScoreUtils {
  async handleMessage({ payload, message, user }) {
    try {
      if (await this.messageCannotScore({ payload, message, user })) return user

      const description = message.provider.parentId
        ? scoreTypes.threadAnswered
        : scoreTypes.messageSent

      const scoreEarned =
        description === scoreTypes.messageSent
          ? scoreRules.message.send
          : scoreRules.thread.send

      await Score.create({
        user: user.uuid,
        score: scoreEarned,
        description,
        details: {
          provider: message.provider.name,
          messageId: message.provider.messageId,
          room: message.provider.room
        }
      })
      return await this.updateUserScore({ user, scoreEarned })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleAchievement({ achievement, user, provider, score: scoreEarned }) {
    try {
      await Score.create({
        user: user.uuid,
        score: scoreEarned,
        description: scoreTypes.newAchievement,
        details: {
          provider: provider.name,
          achievement: achievement.name,
          medal: achievement.medal,
          range: achievement.range
        }
      })

      return await this.updateUserScore({ user, scoreEarned })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleManualScore({ payload, user }) {
    try {
      await Score.create(payload)
      return await this.updateUserScore({ user, scoreEarned: payload.score })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async scoreInactivities() {
    try {
      const daysOfInactivity = moment().subtract(
        scoreRules.daysOfInactivity,
        'days'
      )
      const score = scoreRules.inactivityScore
      const inactives = await User.find({
        lastInteraction: { $lt: daysOfInactivity },
        'score.value': { $gt: 1 }
      })

      for (const user of inactives) {
        await Score.create({
          user: user.uuid,
          score,
          description: scoreTypes.inactivity
        })
        await this.updateUserScore({ user, scoreEarned: score })
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }
}

export default new ScoreController()
