import { levelsList } from '../config/achievements'
import moment from 'moment'
import User from '../models/User'

class LevelController {
  async update({ score, user }) {
    const [currentStatus = { level: 0 }] = user.achievements.filter(
      ({ name }) => name === 'userLevel'
    )

    const updatedStatus = this.updateStatus({ currentStatus, score })
    const othersAchievements = user.achievements.filter(
      ({ name }) => name !== 'userLevel'
    )

    if (currentStatus.level < updatedStatus.level) {
      // SendMessageToUser
    }
    return User.findOneAndUpdate(
      { uuid: user.uuid },
      {
        achievements: [...othersAchievements, updatedStatus]
      }
    )
  }

  updateStatus({ currentStatus, score: scoreGained }) {
    const levels = levelsList()

    if (!currentStatus.level)
      return {
        name: levels[0].name,
        level: 1,
        score: scoreGained,
        scoreToNextLevel: levels[0].scoreToNextLevel,
        earnedIn: moment().toDate()
      }

    currentStatus.score += scoreGained

    if (currentStatus.score >= currentStatus.scoreToNextLevel) {
      for (const { level, scoreToNextLevel } of levels) {
        if (level > currentStatus.level) {
          currentStatus.level = level
          currentStatus.earnedIn = moment().toDate()
          currentStatus.scoreToNextLevel = scoreToNextLevel
          break
        }
      }

      // if (newStatus.score <= scoreToNextLevel && level !== newStatus.level) {
      //   const newAchievement = levels[index - 1]

      //   newStatus.level = newAchievement.level
      //   newStatus.earnedIn = moment().toDate()
      //   newStatus.scoreToNextLevel = scoreToNextLevel
      //   break
      // }
    }
    return currentStatus
  }
}

export default new LevelController()
