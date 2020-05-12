import Score from '../../models/Score'
import User from '../../models/User'
import BotController from '../BotController'
import LogController from '../LogController'
import RankingController from '../RankingController'
import CommandUtils from './utils'

class CommandController extends CommandUtils {
  constructor() {
    super()
    this.commands = {
      '!ranking': this.monthlyRanking,
      '!rankinggeral': this.generalRanking,
      '!meuspontos': this.userScore,
      '!minhasconquistas': this.userAchievements,
      '!comandos': this.sendCommands,
      '!darpontos': this.handleGivePoints,
      '!checkinfos': this.checkInfos,
      '!hey': this.sendMessage
    }
  }

  async handle(payload) {
    try {
      const { provider } = payload
      const user = await User.findOne({
        [`${provider.name}.id`]: provider.user.id
      })

      if (!user) {
        LogController.sendError({
          file: 'CommandController.handle',
          resume: `Unable to find user.`,
          details: payload
        })
        return BotController.sendMessageToUser({
          provider: provider.name,
          message:
            'Opa, algo está errado :/\nTente novamente ou mande uma mensagem lá no canal #duvidas',
          username: provider.user.username
        })
      }

      const command = payload.content.split(' ')[0]
      this.commands[command]({ user, ...payload })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async monthlyRanking({ user, provider, content }) {
    try {
      const { date, monthName } = super.getDateFromMessage(content)

      const { ranking } = await Score.findAllByMonth({
        date,
        offset: 0,
        size: 99999
      })

      const message = super.generateRankingMessage({
        user,
        ranking,
        monthName
      })
      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async generalRanking({ user, provider }) {
    try {
      const { ranking } = await RankingController.getGeneralRanking({
        offset: 0,
        size: 99999
      })

      const message = super.generateRankingMessage({
        user,
        ranking
      })
      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async userScore({ user, provider }) {
    try {
      const message = await super.generateUserScoresMessage(user)

      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async userAchievements({ user, provider }) {
    try {
      const message = super.generateAchievementsMessage(user)

      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async sendCommands({ user, provider }) {
    try {
      const message = super.getCommandsText(user)
      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async checkInfos({ user, provider, content }) {
    try {
      const userBeingVerified = await User.findOne({
        [`${provider.name}.username`]: content
          .trim()
          .split(' ')[1]
          .substr(1)
      })

      const message = super.getUserInfosText({ user, userBeingVerified })

      BotController.sendMessageToUser({
        provider: provider.name,
        message,
        username: provider.user.username
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async sendMessage({ user, provider, mentions, channels, content }) {
    try {
      if (!user.isCoreTeam) {
        return BotController.sendMessageToUser({
          provider: provider.name,
          message: 'Opa, não tens acesso a esta operação.',
          username: provider.user.username
        })
      }
      const message = content
        .split('\n')
        .slice(1)
        .join('\n')

      for (const { username } of mentions) {
        BotController.sendMessageToUser({
          provider: provider.name,
          message,
          username
        })
      }

      for (const { name } of channels) {
        BotController.sendMessageToChannel({
          provider: provider.name,
          message,
          channel: name
        })
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleGivePoints({ user, provider, content }) {
    try {
      if (!user.isCoreTeam) {
        return BotController.sendMessageToUser({
          provider: provider.name,
          message: 'Opa, não tens acesso a esta operação.',
          username: provider.user.username
        })
      }

      const regex = /^!darpontos\s(([@][\w\d-]+\s?)+\s?)\s(\d{1,5})\s"(.*?)"$/g

      const [, userList, , stringPoints, reason] = regex.exec(content)
      const points = parseInt(stringPoints)

      const usernames = userList
        .trim()
        .split(' ')
        .map(username => username.substr(1))

      if (!usernames || !points || !reason) {
        return BotController.sendMessageToUser({
          provider: provider.name,
          message: {
            msg: `Ops! Tem algo *errado* no seu comando. Tente desta forma:
          ${'`!darpontos`'} ${'`@nome-usuário`'} ${'`pontos`'} ${'`"motivo"`'}
          Ah! E o motivo deve estar entre aspas!`
          },
          username: provider.user.username
        })
      }

      super.givePoints({ user, usernames, provider, points, reason })
    } catch (error) {
      LogController.sendError(error)
    }
  }
}

export default new CommandController()
