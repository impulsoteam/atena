import moment from 'moment'

import { messageSended } from '../config/achievements'
import User from '../models/User'
import BotController from './BotController'
import LogController from './LogController'
import ScoreController from './ScoreController'

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

      await User.updateAchievements({
        uuid: user.uuid,
        achievements: [...othersAchievements, currentAchievement]
      })
    } catch (error) {
      LogController.sendError(error)
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
    console.log('-=-=-=-=-=-=-=-=-update')
    try {
      const { name, medal, range, score } = newAchievement
      const achievement = {
        name,
        medal,
        range,
        currentValue: 1,
        nextTarget: nextAchievement.target,
        earnedIn: moment().toDate()
      }

      const updatedUser = await User.updateAchievements({
        uuid: user.uuid,
        achievements: [...user.achievements, achievement]
      })

      const payload = this.generateMessage(newAchievement)
      BotController.sendMessageToUser({
        provider: message.provider.name,
        message: payload,
        username: user[message.provider.name].username
      })
      ScoreController.handleAchievement({
        achievement,
        user: updatedUser,
        provider: message.provider,
        score
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async updateAchievement({ user, message, newAchievement, nextAchievement }) {
    console.log('-=-=-=-=-=-=-=-=-update')
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
    const updatedUser = await User.updateAchievements({
      uuid: user.uuid,
      achievements: [...othersAchievements, achievement]
    })
    const payload = this.generateMessage(newAchievement)
    BotController.sendMessageToUser({
      provider: message.provider.name,
      message: payload,
      username: user[message.provider.name].username
    })
    ScoreController.handleAchievement({
      achievement,
      user: updatedUser,
      provider: message.provider,
      score
    })
  }

  generateMessage({ translatedName, range, translatedMedal }) {
    return `🏅 Você obteve a conquista [${translatedMedal} ${range} | ${translatedName}]!`
  }
}

export default new AchievementController()
