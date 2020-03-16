import LogController from './LogController'
import moment from 'moment'
import Score, { scoreTypes } from '../models/Score'
import scoreRules from '../config/score'
import LevelController from './LevelController'

class ScoreController {
  async handleMessage({ payload, message, user }) {
    try {
      if (await this.messageCannotScore({ payload, message, user })) return user

      const description = message.provider.parentId
        ? scoreTypes.threadAnswered
        : scoreTypes.messageSent

      const score =
        description === scoreTypes.messageSent
          ? scoreRules.message.send
          : scoreRules.thread.send

      await Score.create({
        user: user.uuid,
        score,
        description,
        details: {
          provider: message.provider.name,
          messageId: message.provider.messageId,
          room: message.provider.room
        }
      })
      return await LevelController.update({ score, user })
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/ScoreController.handleMessage',
        resume: 'Unexpected error in ScoreController.handleMessage',
        details: error
      })
    }
  }

  async handleAchievement({ achievement, user, message, score }) {
    try {
      await Score.create({
        user: user.uuid,
        score,
        description: scoreTypes.newAchievement,
        details: {
          provider: message.provider.name,
          achievement: achievement.name,
          medal: achievement.medal,
          range: achievement.range
        }
      })
      await LevelController.update({ score, user })
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/ScoreController.handleAchievement',
        resume: 'Unexpected error in ScoreController.handleAchievement',
        details: error
      })
    }
  }

  async handleReaction() {
    try {
      // AchievementController.scoreUpdated({})
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/ScoreController.handleReaction',
        resume: 'Unexpected error in ScoreController.handleReaction',
        details: error
      })
    }
  }

  async messageCannotScore({ payload, message }) {
    const isSameUser = payload.previousMessage.user === message.provider.user.id
    const isFlood =
      moment().diff(payload.previousMessage.createdAt, 'seconds') <=
      scoreRules.flood
    if (isSameUser && isFlood) return true

    const scoreOfTheDay = await this.getDailyScore(message.user)

    if (scoreOfTheDay >= scoreRules.dailyLimit) return true
  }

  async getDailyScore(uuid) {
    const result = await Score.aggregate([
      {
        $match: {
          user: uuid,
          $and: [
            {
              createdAt: {
                $gte: moment()
                  .startOf('day')
                  .toDate()
              }
            },
            {
              createdAt: {
                $lte: moment()
                  .endOf('day')
                  .toDate()
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: '',
          score: { $sum: '$score' }
        }
      },
      {
        $project: {
          _id: 0,
          score: '$score'
        }
      }
    ])

    return result.length ? result[0].score : 0
  }
}

export default new ScoreController()
