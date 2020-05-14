import moment from 'moment'

import getAchievementValues, { messageProviders } from '../config/achievements'
import User from '../models/User'
import { publish } from '../services/amqp'
import BotController from './BotController'
import LogController from './LogController'
import ScoreController from './ScoreController'

class AchievementController {
  async handle({ user, achievementType, provider }) {
    try {
      const achievementRanges = getAchievementValues(achievementType)
      const [currentAchievement] = user.achievements.filter(
        ({ name }) => name === achievementType
      )

      if (!currentAchievement) {
        return this.createAchievement({ user, provider, achievementRanges })
      }

      currentAchievement.currentValue++
      if (currentAchievement.currentValue === currentAchievement.nextTarget) {
        const { newAchievement, nextAchievement } = this.getAchievements({
          achievementRanges,
          currentAchievement
        })
        return this.updateAchievement({
          user,
          provider,
          newAchievement,
          nextAchievement,
          achievementType,
          achievementRanges
        })
      }

      const othersAchievements = user.achievements.filter(
        ({ name }) => name !== achievementType
      )

      await User.updateAchievements({
        uuid: user.uuid,
        achievements: [...othersAchievements, currentAchievement]
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  getAchievements({ achievementRanges, currentAchievement }) {
    let newAchievement, nextAchievement, nextIndex

    for (const [index, currentRange] of achievementRanges.entries()) {
      if (nextIndex !== undefined) {
        nextAchievement = achievementRanges[nextIndex]
        break
      }

      const { medal, range } = currentRange

      if (
        medal === currentAchievement.medal &&
        range === currentAchievement.range
      ) {
        newAchievement = achievementRanges[index + 1]
        nextIndex = index + 2
      }
    }

    return { newAchievement, nextAchievement }
  }

  async createAchievement({ user, provider, achievementRanges }) {
    try {
      const { name, medal, range, score } = achievementRanges[0]
      const achievement = {
        name,
        medal,
        range,
        currentValue: 1,
        nextTarget: achievementRanges[1].target,
        earnedIn: moment().toDate()
      }

      this.handleAchievementChange({
        user,
        score,
        provider,
        achievementRanges,
        newAchievement: achievement,
        othersAchievements: user.achievements
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async updateAchievement({
    user,
    provider,
    achievementType,
    achievementRanges,
    nextAchievement,
    newAchievement
  }) {
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
      ({ name }) => name !== achievementType
    )

    this.handleAchievementChange({
      user,
      score,
      provider,
      achievementRanges,
      newAchievement: achievement,
      othersAchievements
    })
  }

  async handleAchievementChange({
    user,
    score,
    provider,
    newAchievement,
    achievementRanges,
    othersAchievements
  }) {
    try {
      const updatedUser = await User.updateAchievements({
        uuid: user.uuid,
        achievements: [...othersAchievements, newAchievement]
      })

      const message = this.generateMessage({
        newAchievement,
        achievementRanges
      })

      const providerOrDefault = messageProviders(provider)
      BotController.sendMessageToUser({
        provider: providerOrDefault,
        message,
        username: user[providerOrDefault].username
      })

      ScoreController.handleAchievement({
        achievement: newAchievement,
        user: updatedUser,
        provider,
        score
      })
      publish({
        type: 'achievement',
        uuid: user.uuid,
        achievement: newAchievement
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  generateMessage({ achievementRanges, newAchievement }) {
    const { translatedMedal, range, translatedName } = achievementRanges.find(
      ({ name, medal, range }) =>
        name === newAchievement.name &&
        medal === newAchievement.medal &&
        range === newAchievement.range
    )
    return `🏅 Você obteve a conquista [${translatedMedal} ${range} | ${translatedName}]!`
  }
}

export default new AchievementController()
