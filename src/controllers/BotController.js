import { sendMessage as rocketchat } from '../services/rocketchat/driver'

class BotController {
  constructor() {
    this.rocketchat = rocketchat
  }

  async sendMessageToUser({ provider, message, username }) {
    console.log(provider)
    // console.log(rocketchat)
    // console.log(this)
    // console.log(this[provider])

    rocketchat({ message, username })
  }
}

export default new BotController({ rocketchat })
