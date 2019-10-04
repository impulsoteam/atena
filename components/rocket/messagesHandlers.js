import User from '../users/user'
import Message from '../models/message'
import Reaction from '../models/reaction'
import Score from '../models/score'
import config from 'config-yml'
import commands from '../commands'
import commandUtils from '../commands/commandsUtils'

export default async message => {
  const msg = await Message.findOne({ 'rocketData.messageId': message._id })
  const user = await User.findOne({ rocketId: message.u._id })

  if (isCommand(message)) return handleCommand(message, user)
  if (!msg && !message.tmid) return handleNewMessage(message, user)
  if (!msg && message.tmid) return handleReply(message, user)
  return handleReactions(message, msg)
}

const isCommand = message => {
  const commandsList = Object.values(commandUtils.getCommandsRegex())
  return commandsList.find(command => new RegExp(command).test(message.msg))
}

const handleCommand = (message, user) => {
  commands.handle(message)
  Message.create({
    user: user._id,
    'rocketData.messageId': message._id,
    'rocketData.roomId': message.rid,
    'rocketData.userId': message.u._id,
    content: message.msg,
    'is.command': true
  })
}

const handleNewMessage = async (message, user) => {
  const msg = await Message.create({
    user: user._id,
    'rocketData.messageId': message._id,
    'rocketData.roomId': message.rid,
    'rocketData.userId': message.u._id,
    content: message.msg
  })

  Score.create({
    value: config.xprules.messages.send,
    description: 'New message',
    user: user._id,
    ref: msg._id,
    refModel: 'Message'
  })
}

const handleReply = async (message, user) => {
  const parentMessage = await Message.findOne({
    'rocketData.messageId': message.tmid
  })

  const msg = await Message.create({
    user: user._id,
    'rocketData.messageId': message._id,
    'rocketData.roomId': message.rid,
    'rocketData.parent': parentMessage.rocketData.messageId,
    'rocketData.userId': message.u._id,
    content: message.msg,
    parent: parentMessage._id
  })

  Score.create({
    value: config.xprules.threads.send,
    description: 'New reply sent',
    user: user._id,
    ref: msg._id,
    refModel: 'Message'
  })

  Score.create({
    value: config.xprules.threads.receive,
    description: 'New reply received',
    user: parentMessage.user,
    ref: parentMessage._id,
    refModel: 'Message'
  })

  parentMessage.is.thread = true
  parentMessage.save()
}

const handleReactions = async (message, msg) => {
  const reactionsMatrix = createReactionsMatrixFromRocketMessage(message)
  const reactions = await Reaction.find({ message: msg._id })

  if (reactionsMatrix.length === reactions.length) return
  if (reactionsMatrix.length > reactions.length) {
    const subject = reactionsMatrix.filter(rm => {
      return !reactions.find(r => {
        return rm.username === r.rocketData.username && rm.content === r.content
      })
    })

    subject.map(async reaction => {
      const user = await User.findOne({ username: reaction.username })
      const newReaction = await Reaction.create({
        message: msg._id,
        user: user._id,
        content: reaction.content,
        'rocketData.messageId': message._id,
        'rocketData.userId': user.rocketId,
        'rocketData.username': reaction.username
      })

      Score.create({
        value: config.xprules.reaction.send,
        user: user._id,
        description: 'Reaction sent',
        ref: newReaction._id,
        refModel: 'Reaction'
      })

      Score.create({
        value: config.xprules.reaction.receive,
        user: msg.user,
        description: 'Reaction received',
        ref: newReaction._id,
        refModel: 'Reaction'
      })
    })
  } else {
    const subject = reactions.filter(r => {
      return !reactionsMatrix.find(rm => {
        return rm.username === r.rocketData.username && rm.content === r.content
      })
    })

    subject.map(async reaction => {
      await Promise.all([
        Score.deleteMany({ ref: reaction._id, refModel: 'Reaction' }),
        Reaction.deleteOne({ _id: reaction._id })
      ])
    })
  }
}

const createReactionsMatrixFromRocketMessage = message => {
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
