// import Message from '../models/Message'
// import User from '../models/User'
import LogController from '../controllers/LogController'
import moment from 'moment'
import User from '../models/User'
import { messageSended } from '../config/achievements'

class AchievementController {
  async messageSended(user) {
    try {
      const medals = messageSended()
      const [currentAchievement] = user.achievements.filter(
        ({ name }) => name === 'messageSended'
      )

      if (!currentAchievement)
        return this.createAchievement({
          user,
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

  async createAchievement({ user, newAchievement, nextAchievement }) {
    const { name, medal, target, range, score } = newAchievement
    const achievement = {
      name,
      medal,
      range,
      currentValue: 1,
      nextTarget: nextAchievement.target,
      earnedIn: moment().toDate()
    }
    await User.updateOne(
      { uuid: user.uuid },
      { achievements: [...user.achievements, achievement] }
    )
    // todo create score
  }

  async updateAchievement({ user, newAchievement, nextAchievement }) {
    const { name, medal, target, range, score } = newAchievement
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
    await User.updateOne(
      { uuid: user.uuid },
      { achievements: [...othersAchievements, achievement] }
    )

    // todo create score
  }
}

export default new AchievementController()
