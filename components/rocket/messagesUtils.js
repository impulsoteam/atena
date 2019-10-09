import config from 'config-yml'
import moment from 'moment'
import commandUtils from '../commands/commandsUtils'
import Message from '../models/message'
import Score from '../models/score'

export const isCommand = message => {
  const commandsList = Object.values(commandUtils.getCommandsRegex())
  return commandsList.find(command => new RegExp(command).test(message.msg))
}

export const isScoreInDailyLimit = async user => {
  const currentDatescore = await Score.currentDateTotalScore(user)
  return currentDatescore < config.xprules.limits.daily
}

export const isLastMessageOwner = async (user, message) => {
  const lastMessage = await Message.findOne({
    'rocketData.roomId': message.rid,
    'rocketData.messageId': { $ne: message._id },
    createdAt: { $gt: moment().add(-config.xprules.limits.time, 'minutes') }
  }).sort({ createdAt: -1 })

  if (!lastMessage) return false
  return lastMessage.user.toString() === user._id.toString()
}

export const canScoreAndNotLastMessageOwner = async (user, message) => {
  const [canScore, lastMessageOwner] = await Promise.all([
    isScoreInDailyLimit(user._id),
    isLastMessageOwner(user, message)
  ])

  return canScore && !lastMessageOwner
}

export const createReactionsMatrixFromRocketMessage = message => {
  const { reactions } = message
  if (!reactions) return []
  const keys = Object.keys(reactions)
  const matrix = keys.map(key => {
    return reactions[key].usernames.map(username => {
      return {
        username,
        content: key
      }
    })
  })

  return matrix.flat()
}
