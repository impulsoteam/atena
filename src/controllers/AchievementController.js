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
      if (
        currentAchievement.nextTarget &&
        currentAchievement.nextTarget === currentAchievement.currentValue
      ) {
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
      const { name, medal, range, score, displayNames } = achievementRanges[0]

      const achievement = {
        name,
        medal,
        range,
        displayNames,
        currentValue: 1,
        nextTarget: achievementRanges[1].target,
        earnedIn: moment().toDate()
      }

      this.handleAchievementChange({
        user,
        score,
        provider,
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
    nextAchievement,
    newAchievement
  }) {
    const { name, medal, range, score, displayNames } = newAchievement
    const achievement = {
      name,
      medal,
      range,
      displayNames,
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
      newAchievement: achievement,
      othersAchievements
    })
  }

  async handleAchievementChange({
    user,
    score,
    provider,
    newAchievement,
    othersAchievements
  }) {
    try {
      const updatedUser = await User.updateAchievements({
        uuid: user.uuid,
        achievements: [...othersAchievements, newAchievement]
      })

      const message = this.generateMessage(newAchievement)

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

  generateMessage({ displayNames, range }) {
    return `🏅 Você obteve a conquista [${displayNames.medal} ${range} | ${displayNames.achievement}]!`
  }
}

export default new AchievementController()
