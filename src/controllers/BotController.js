import moment from 'moment'

import { sendMessage as sendRocketchatMessage } from '../services/rocketchat/driver'
import LogController from './LogController'
import RankingController from './RankingController'

const providers = {
  rocketchat: payload => sendRocketchatMessage(payload)
}

class BotController {
  sendMessageToChannel({ provider, message, channel }) {
    const service = providers[provider]

    if (service) {
      service({ message, channel })
    } else {
      LogController.sendError({
        file: 'BotController.sendMessageToChannel',
        resume: `Unable to find service to provider ${provider}`,
        details: { provider, channel }
      })
    }
  }

  sendMessageToUser({ provider, message, username }) {
    const service = providers[provider]

    if (service) {
      service({ message, username })
    } else {
      LogController.sendError({
        file: 'BotController.sendMessageToUser',
        resume: `Unable to find service to provider ${provider}`,
        details: { provider, username }
      })
    }
  }

  async sendMonthlyRankingToChannel() {
    const ranking = await RankingController.getMonthlyRanking({ limit: 5 })
    if (ranking.message || ranking.length < 5) return

    const channels = process.env.DEFAULT_CHANNELS.split('|')
    const monthName = moment()
      .locale('pt')
      .format('MMMM')
    const message = {
      msg: `Saiba quem são as pessoas que mais me orgulham no Olimpo pela interação. Essas nobres pessoas têm se destacado em meu templo em ${monthName}:`,
      attachments: []
    }

    message.attachments = ranking.map((user, index) => {
      return {
        text: `${index + 1}º lugar está *${user.name}* com *${
          user.score
        }* pontos de reputação e nível *${user.level}*`
      }
    })

    for (const provider of Object.keys(providers)) {
      for (const channel of channels) {
        const service = providers[provider]

        if (service) {
          service({ message, channel })
        } else {
          LogController.sendError({
            file: 'BotController.sendMessageToChannel',
            resume: `Unable to find service to provider ${provider}`,
            details: { provider, channel }
          })
        }
      }
    }
  }
}

export default new BotController()
