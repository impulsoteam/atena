import { sendError } from 'log-on-slack'
import moment from 'moment'

import { scoreRules } from '../../config/score'
import Score from '../../models/Score'
import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import AchievementController from '../AchievementController'
import ScoreUtils from './utils'

class ScoreController extends ScoreUtils {
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
      sendError({
        file: 'controllers/ScoreController.handleAchievement',
        payload: { achievement, user, provider, score: scoreEarned },
        error
      })
    }
  }

  async handleMeetupSubscription({ user, meetup }) {
    const scoreEarned = scoreRules.meetup.subscription

    await Score.create({
      user: user.uuid,
      score: scoreEarned,
      description: scoreTypes.subscribedToMeetup,
      details: {
        meetup
      }
    })

    return this.updateUserScore({ user, scoreEarned })
  }

  async handleMeetupParticipation({ user, meetup }) {
    const scoreEarned = scoreRules.meetup.participation

    await Score.create({
      user: user.uuid,
      score: scoreEarned,
      description: scoreTypes.participatedToMeetup,
      details: {
        meetup
      }
    })

    return this.updateUserScore({ user, scoreEarned })
  }

  async handleExternalInteraction(payload) {
    try {
      const { scoreType, achievementType, queries, details } = payload

      const user = await User.findOne(queries.user)
      if (!user) return

      const lastScore = await Score.findOne({
        user: user.uuid,
        description: scoreType,
        ...queries.details
      }).sort({ 'details.occurredAt': -1 })

      if (lastScore) {
        const lastInteraction = moment(lastScore.details.occurredAt)

        const pastHours = moment
          .duration(moment(details.occurredAt).diff(lastInteraction))
          .asHours()

        if (pastHours < scoreRules[scoreType].limit)
          return await AchievementController.handle({
            user,
            achievementType,
            provider: details.provider
          })
      }

      const score = scoreRules[scoreType].score

      await Score.create({
        user: user.uuid,
        score,
        description: scoreType,
        details
      })

      const updatedUser = await this.updateUserScore({
        user,
        scoreEarned: score
      })

      await AchievementController.handle({
        user: updatedUser,
        achievementType,
        provider: details.provider
      })
    } catch (error) {
      sendError({
        file: 'controllers/ScoreController.handleExternalInteraction',
        payload,
        error
      })
    }
  }

  async handleManualScore({ payload, user }) {
    try {
      await Score.create(payload)
      return await this.updateUserScore({ user, scoreEarned: payload.score })
    } catch (error) {
      sendError({
        file: 'controllers/ScoreController.handleManualScore',
        payload: { payload, user },
        error
      })
    }
  }

  async handleProfileCompleteness(payload) {
    try {
      const { uuid, completeness, provider } = payload

      let user = await User.findOne({ uuid })

      if (!user) throw new Error('User not found')

      if (user.profileCompleteness.total >= completeness.total)
        return await User.updateOne(
          { uuid: user.uuid },
          { profileCompleteness: completeness }
        )

      const previousScores = await Score.find({
        user: user.uuid,
        description: scoreTypes.profileCompleteness
      })

      const { profileCompleteness } = scoreRules

      for (const [percentage, score] of Object.entries(profileCompleteness)) {
        if (completeness.total < parseInt(percentage)) break

        const hasPreviousScore = previousScores.find(
          ({ details }) => parseInt(percentage) === details.percentage
        )

        if (!hasPreviousScore) {
          await Score.create({
            user: user.uuid,
            score,
            description: scoreTypes.profileCompleteness,
            details: {
              provider,
              percentage
            }
          })

          user = await this.updateUserScore({ user, scoreEarned: score })
        }
      }

      await User.updateOne(
        { uuid: user.uuid },
        { profileCompleteness: completeness }
      )
    } catch (error) {
      sendError({
        file: 'controllers/ScoreController.handleProfileCompleteness',
        payload,
        error
      })
    }
  }
}

export default new ScoreController()
