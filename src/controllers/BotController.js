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
}

export default new BotController()
