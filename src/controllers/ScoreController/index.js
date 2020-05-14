import moment from 'moment'

import { scoreRules } from '../../config/score'
import Score from '../../models/Score'
import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import AchievementController from '../AchievementController'
import LogController from '../LogController'
import ScoreUtils from './utils'

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
          provider,
          achievement: achievement.name,
          medal: achievement.medal,
          range: achievement.range
        }
      })

      await this.updateUserScore({ user, scoreEarned })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleClickOnProduct(payload) {
    const {
      achievementType,
      product,
      description,
      provider,
      uuid,
      time
    } = payload

    const user = await User.findOne({ uuid })

    if (!user)
      return LogController.sendError({
        file: 'ScoreController.handleClickOnProduct',
        resume: `Unable to find user`,
        details: { payload }
      })

    const lastScore = await Score.findOne({
      user: uuid,
      description,
      'details.product': product
    })

    if (lastScore) {
      const currentInteraction = moment(time).utc()
      const lastInteraction = moment(lastScore.createdAt)

      const pastHours = moment
        .duration(currentInteraction.diff(lastInteraction))
        .asHours()

      if (pastHours < scoreRules.clickOnProduct.limit)
        return AchievementController.handle({
          user,
          achievementType,
          provider: provider.name
        })
    }

    const score = scoreRules.clickOnProduct.score

    await Score.create({
      user: user.uuid,
      score,
      description,
      details: {
        provider: provider.name,
        product
      }
    })

    const updatedUser = await this.updateUserScore({ user, scoreEarned: score })
    AchievementController.handle({
      user: updatedUser,
      achievementType,
      provider: provider.name
    })
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
