import RankingController from '../RankingController'
import BotController from '../BotController'
import User from '../../models/User'
import LogController from '../LogController'
import CommandUtils from './utils'
import Score from '../../models/Score'

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

  handle(payload) {
    const command = payload.content.split(' ')[0]
    this.commands[command](payload)
  }

  async monthlyRanking({ provider, content }) {
    try {
      const { date, monthName } = super.getDateFromMessage(content)

      const ranking = await Score.findAllByMonth({ date })
      const user = await User.findOne({
        [`${provider.name}.id`]: provider.user.id
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

  async generalRanking({ provider }) {
    try {
      const ranking = await RankingController.getGeneralRanking({})
      const user = await User.findOne({
        [`${provider.name}.id`]: provider.user.id
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

  async userScore({ provider }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

    const message = await super.generateUserScoresMessage(user)

    BotController.sendMessageToUser({
      provider: provider.name,
      message,
      username: provider.user.username
    })
  }

  async userAchievements({ provider }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

    const message = super.generateAchievementsMessage(user)

    BotController.sendMessageToUser({
      provider: provider.name,
      message,
      username: provider.user.username
    })
  }

  async sendCommands({ provider }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

    const message = super.getCommandsText(user)
    BotController.sendMessageToUser({
      provider: provider.name,
      message,
      username: provider.user.username
    })
  }

  async checkInfos({ provider, content }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

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
  }

  async sendMessage({ provider, mentions, channels, content }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

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
  }

  async handleGivePoints({ provider, content }) {
    const user = await User.findOne({
      [`${provider.name}.id`]: provider.user.id
    })

    if (!user.isCoreTeam) {
      return BotController.sendMessageToUser({
        provider: provider.name,
        message: 'Opa, não tens acesso a esta operação.',
        username: provider.user.username
      })
    }

    const regex = /^!darpontos\s(([@][\w\d-]+\s?)+\s?)\s(\d{1,5})\s"(.*?)"$/g

    const [, userList, , points, reason] = regex.exec(content)

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
  }
}

export default new CommandController()
