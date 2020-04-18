import LogController from './LogController'
import moment from 'moment'
import Score, { scoreTypes } from '../models/Score'
import { scoreRules, levelsList } from '../config/score'
import User from '../models/User'
import BotController from './BotController'
import { generateStorytelling } from '../assets/storytelling'
import LevelController from './LevelController'
class ScoreController {
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

      const { level, score } = this.getValues({ user, scoreEarned })

      const updatedUser = await User.updateScore({
        uuid: user.uuid,
        score,
        level
      })
      if (user.level.value < level.value) {
        const { provider } = message
        const username = user[provider.name].username

        BotController.sendMessageToUser({
          provider: message.provider.name,
          message: generateStorytelling({
            username,
            level: level.value
          }),
          username
        })

        LevelController.handle({
          user: updatedUser,
          previousLevel: user.level.value
        })
      }

      return updatedUser
    } catch (error) {
      LogController.sendError(error)
    }
  }

  getValues({ user, scoreEarned }) {
    const levels = levelsList()
    const score = {
      value: user.score.value + scoreEarned,
      lastUpdate: moment()
    }

    const [updatedLevel] = levels.filter(
      ({ range }) => range[0] <= score.value && range[1] >= score.value
    )
    const level =
      updatedLevel.level !== user.level.value
        ? {
            value: updatedLevel.level,
            scoreToNextLevel: updatedLevel.scoreToNextLevel,
            lastUpdate: moment()
          }
        : user.level
    return { level, score }
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
      const { level, score } = this.getValues({ user, scoreEarned })

      const updatedUser = await User.updateScore({
        uuid: user.uuid,
        score,
        level
      })
      if (user.level.value < level.value) {
        const username = user[provider.name].username
        const message = generateStorytelling({
          username,
          level: level.value
        })
        BotController.sendMessageToUser({
          provider: provider.name,
          message,
          username
        })

        LevelController.handle({
          user: updatedUser,
          previousLevel: user.level.value
        })
      }

      return updatedUser
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleReaction() {
    try {
      // AchievementController.scoreUpdated({})
    } catch (error) {
      LogController.sendError(error)
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
