// import Message from '../models/Message'
// import User from '../models/User'
import LogController from './LogController'
import ScoreController from './ScoreController'
import moment from 'moment'
import User from '../models/User'
import { messageSended } from '../config/achievements'

class AchievementController {
  async messageSended({ user, message }) {
    try {
      const medals = messageSended()
      const [currentAchievement] = user.achievements.filter(
        ({ name }) => name === 'messageSended'
      )
      if (!currentAchievement)
        return this.createAchievement({
          user,
          message,
          newAchievement: medals[0],
          nextAchievement: medals[1]
        })

      currentAchievement.currentValue++
      if (currentAchievement.currentValue === currentAchievement.nextTarget) {
        const { newAchievement, nextAchievement } = this.getAchievements({
          medals,
          currentAchievement
        })
        return this.updateAchievement({
          user,
          message,
          nextAchievement,
          newAchievement
        })
      }
      const othersAchievements = user.achievements.filter(
        ({ name }) => name !== 'messageSended'
      )

      await User.updateOne({
        uuid: user.uuid,
        achievements: [...othersAchievements, currentAchievement]
      })
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/AchievementController',
        resume: 'Unexpected error in method handle',
        details: error
      })
    }
  }

  getAchievements({ medals, currentAchievement }) {
    let newAchievement, nextAchievement, nextIndex

    for (const [index, currentRange] of medals.entries()) {
      if (nextIndex !== undefined) {
        nextAchievement = medals[nextIndex]
        break
      }

      const { medal, range } = currentRange

      if (
        medal === currentAchievement.medal &&
        range === currentAchievement.range
      ) {
        newAchievement = medals[index + 1]
        nextIndex = index + 2
      }
    }

    return { newAchievement, nextAchievement }
  }

  async createAchievement({ user, message, newAchievement, nextAchievement }) {
    const { name, medal, range, score } = newAchievement
    const achievement = {
      name,
      medal,
      range,
      currentValue: 1,
      nextTarget: nextAchievement.target,
      earnedIn: moment().toDate()
    }

    const updatedUser = await User.findOneAndUpdate(
      { uuid: user.uuid },
      { achievements: [...user.achievements, achievement] }
    )

    ScoreController.handleAchievement({
      achievement,
      user: updatedUser,
      message,
      score
    })
  }

  async updateAchievement({ user, message, newAchievement, nextAchievement }) {
    const { name, medal, range, score } = newAchievement
    const achievement = {
      name,
      medal,
      range,
      currentValue: newAchievement.target,
      nextTarget: nextAchievement.target,
      earnedIn: moment().toDate()
    }
    const othersAchievements = user.achievements.filter(
      ({ name }) => name !== 'messageSended'
    )
    const updatedUser = await User.findOneAndUpdate(
      { uuid: user.uuid },
      { achievements: [...othersAchievements, achievement] }
    )
    ScoreController.handleAchievement({
      achievement,
      user: updatedUser,
      message,
      score
    })
  }
}

export default new AchievementController()
