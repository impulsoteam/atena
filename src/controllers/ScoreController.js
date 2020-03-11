// import Message from '../models/Message'
// import User from '../models/User'
import LogController from './LogController'
import moment from 'moment'
import Score from '../models/Score'
import scoreRules from '../config/score'

class ScoreController {
  async handleMessage({ payload, message, user }) {
    try {
      // if (await this.messageCannotScore({ payload, message, user })) return

      await Score.create({
        user: user.uuid,
        value: 3,
        description: 'MESSAGE_SENT',
        provider: {
          name: 'rocketchat',
          messageId: message.provider.messageId,
          room: {
            id: message.provider.room.id,
            name: message.provider.room.name
          }
        }
      })
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/ScoreController.handleMessage',
        resume: 'Unexpected error in ScoreController.handleMessage',
        details: error
      })
    }
  }

  async handleReaction() {
    try {
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/ScoreController.handleReaction',
        resume: 'Unexpected error in ScoreController.handleReaction',
        details: error
      })
    }
  }

  async messageCannotScore({ payload, message }) {
    const isSameUser = payload.previousMessage.user === message.provider.user.id
    const isFlood =
      moment().diff(payload.previousMessage.createdAt, 'minutes') <
      scoreRules.flood
    console.log(moment().diff(payload.previousMessage.createdAt, 'minutes'))
    if (isSameUser && isFlood) return true
  }
}

export default new ScoreController()
