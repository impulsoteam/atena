import config from 'config-yml'
import User from '../users/user'
import Message from '../models/message'
import Reaction from '../models/reaction'
import Score from '../models/score'
import commands from '../commands'
import {
  isCommand,
  isScoreInDailyLimit,
  isLastMessageOwner,
  canScoreAndNotLastMessageOwner,
  createReactionsMatrixFromRocketMessage
} from './messagesUtils'

export default async message => {
  const msg = await Message.findOne({ 'rocketData.messageId': message._id })
  const user = await User.findOne({ rocketId: message.u._id })

  if (isCommand(message)) return handleCommand(message, user)
  if (!msg && !message.tmid) return handleNewMessage(message, user)
  if (!msg && message.tmid) return handleReply(message, user)
  return handleReactions(message, msg)
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

  if (await canScoreAndNotLastMessageOwner(user, message)) {
    Score.create({
      value: config.xprules.messages.send,
      description: 'New message',
      user: user._id,
      ref: msg._id,
      refModel: 'Message'
    })
  }
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

  if (await canScoreAndNotLastMessageOwner(user, message)) {
    Score.create({
      value: config.xprules.threads.send,
      description: 'New reply sent',
      user: user._id,
      ref: msg._id,
      refModel: 'Message'
    })
  }

  if (await isScoreInDailyLimit(parentMessage.user)) {
    Score.create({
      value: config.xprules.threads.receive,
      description: 'New reply received',
      user: parentMessage.user,
      ref: parentMessage._id,
      refModel: 'Message'
    })
  }

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

      if (await isScoreInDailyLimit(user._id)) {
        Score.create({
          value: config.xprules.reaction.send,
          user: user._id,
          description: 'Reaction sent',
          ref: newReaction._id,
          refModel: 'Reaction'
        })
      }

      if (await isScoreInDailyLimit(msg.user)) {
        Score.create({
          value: config.xprules.reaction.receive,
          user: msg.user,
          description: 'Reaction received',
          ref: newReaction._id,
          refModel: 'Reaction'
        })
      }
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
