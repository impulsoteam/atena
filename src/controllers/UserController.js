import User from '../models/User'
import LogController from './LogController'
import BotController from './BotController'
import { onboardingMessage } from '../assets/onboarding'
import RankingController from './RankingController'

class UserController {
  constructor() {
    this.validProviders = ['rocketchat']
  }

  async handle(payload) {
    try {
      const { newUser, user } = await User.createOrUpdate(payload)

      if (newUser) {
        for (const provider of this.validProviders) {
          if (user[provider])
            BotController.sendMessageToUser({
              provider,
              message: onboardingMessage,
              username: user[provider].username
            })
        }
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async delete(payload) {
    try {
      const result = await User.deleteUserData(payload.uuid)

      if (result.notFound) return
      LogController.sendNotify({
        file: 'controllers/UserController.delete',
        resume: `User data removed`,
        details: {
          uuid: payload.uuid,
          email: payload.email,
          result
        }
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async getProfile(uuid) {
    try {
      if (!uuid) return { error: 'UUID não enviado' }

      const user = await User.findOne({ uuid })
      if (!user) return { error: 'Usuário não encontrado' }
      const types = {
        messageSended: {
          name: 'Network | Mensagens Enviadas',
          type: 'network.message.sended'
        }
      }
      const medals = {
        bronze: 'Bronze',
        silver: 'Prata',
        gold: 'Ouro',
        platinum: 'Platina',
        diamond: 'Diamante'
      }

      const allAchievements = user.achievements.map(
        ({ name, medal, range, currentValue, nextTarget }) => ({
          type: types[name].type,
          name: types[name].name,
          medal: medals[medal],
          tier: range,
          score: currentValue,
          maxScore: nextTarget
        })
      )

      const response = {
        name: user.name,
        avatar: user.avatar,
        level: user.level.value,
        score: user.score.value,
        userAchievements: [
          {
            name: 'Network',
            achievements: allAchievements
          }
        ]
      }

      if (user.isCoreTeam) {
        response.generalPosition = 'coreTeam'
        response.monthlyPosition = 'coreTeam'
      } else {
        const general = await RankingController.getGeneralPositionByUser(
          user.uuid
        )
        const monthly = await RankingController.getMonthlyPositionByUser(
          user.uuid
        )
        response.generalPosition = general.position
        response.monthlyPosition = monthly.position
      }

      return response
    } catch (error) {
      LogController.sendError(error)
      return { error: 'Unable to search for user' }
    }
  }

  async getEveryoneWhoScored() {
    try {
      const users = await User.find({ 'score.value': { $gt: 0 } })

      const response = users.map(
        ({
          uuid,
          name,
          email,
          rocketchat,
          isCoreTeam,
          level,
          score,
          createdAt
        }) => ({
          uuid: uuid,
          name: name,
          email: email,
          username: rocketchat.username,
          isCoreTeam: isCoreTeam,
          level: level.value,
          score: score.value,
          createdAt: createdAt
        })
      )
      return response
    } catch (error) {
      LogController.sendError(error)
      return { error: 'Could not generate user list' }
    }
  }

  async getUserInfos(uuid) {
    const user = await User.findOne({ uuid })
    if (!user) return { error: 'Unable to find user' }
    const general = await RankingController.getGeneralPositionByUser(uuid)
    const monthly = await RankingController.getMonthlyPositionByUser(uuid)

    return {
      user: { level: user.level.value, score: user.score.value },
      rankings: { general, monthly },
      userAchievements: user.achievements.map(achievement => ({
        type: achievement.name,
        name: achievement.name,
        medal: achievement.medal,
        tier: achievement.range,
        score: achievement.currentValue,
        maxScore: achievement.nextTarget
      }))
    }
  }
}

export default new UserController()
