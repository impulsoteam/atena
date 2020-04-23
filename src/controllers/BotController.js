import { sendMessage as sendRocketchatMessage } from '../services/rocketchat/driver'
import LogController from './LogController'

const providers = {
  rocketchat: payload => sendRocketchatMessage(payload)
}
class BotController {
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
}

export default new BotController()
