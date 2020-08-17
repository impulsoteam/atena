import moment from 'moment'

import { sendError } from '../services/log'
import { sendMessage as sendRocketchatMessage } from '../services/rocketchat/driver'
import RankingController from './RankingController'

const providers = {
  rocketchat: payload => sendRocketchatMessage(payload)
}

class BotController {
  sendMessageToChannel({ provider, message, channel }) {
    try {
      const service = providers[provider]
      if (!service) throw new Error('Unable to find provider')

      service({ message, channel })
    } catch (error) {
      sendError({
        file: 'src/controllers/bot - sendMessageToChannel',
        payload: { provider, message, channel },
        error
      })
    }
  }

  sendMessageToUser({ provider, message, username }) {
    try {
      const service = providers[provider]
      if (!service) throw new Error('Unable to find provider')

      service({ message, username })
    } catch (error) {
      sendError({
        file: 'src/controllers/bot - sendMessageToUser',
        payload: { provider, message, username },
        error
      })
    }
  }

  async sendMonthlyRankingToChannel() {
    try {
      const { ranking } = await RankingController.getMonthlyRanking({
        offset: 0,
        size: 5
      })
      if (ranking.length < 5) return

      const channels = process.env.DEFAULT_CHANNELS.split('|')
      const monthName = moment().locale('pt').format('MMMM')
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
          service({ message, channel })
        }
      }
    } catch (error) {
      sendError({
        file: 'src/controllers/bot - sendMonthlyRankingToChannel',
        error
      })
    }
  }
}

export default new BotController()
