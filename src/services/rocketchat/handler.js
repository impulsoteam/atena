import moment from 'moment'

import CommandController from '../../controllers/CommandController'
import LogController from '../../controllers/LogController'
import MessageController from '../../controllers/MessageController'
import ReactionController from '../../controllers/ReactionController'
import Login from '../../models/Login'
import { providers } from '../../models/Message/schema'
import User from '../../models/User'
import { removeEmptyValues } from '../../utils'
import { getPreviousMessage, getUserInfo } from './api'

export const handlePayload = async ({ message, messageOptions }) => {
  try {
    const isChannelMessage = messageOptions.roomType === 'c'
    const isCommand = Object.keys(CommandController.commands).includes(
      message.msg.split(' ')[0]
    )

    const payload = formatPayload({ message, messageOptions })

    if (isCommand) return CommandController.handle(payload)

    if (isChannelMessage) {
      const previousMessage = await getPreviousMessage({ roomId: message.rid })

      MessageController.handle({ previousMessage, ...payload })
      ReactionController.handle(payload)
    }
  } catch (error) {
    LogController.sendError(error)
  }
}

export const handleUserStatus = async id => {
  try {
    const provider = providers.rocketchat
    const userInfo = await getUserInfo(id)

    if (userInfo.roles.includes('bot')) return

    const user = await User.findOne({ [`${provider}.id`]: id })

    if (!user) {
      return LogController.sendError({
        file: 'services.rocketchat - handleUserStatus',
        resume: `Unable to find user ${id}`,
        details: userInfo
      })
    }

    const status =
      userInfo.statusConnection === 'offline' ? 'offline' : 'online'

    const lastUserLogin = await Login.findOne({ user: user.uuid }).sort({
      createdAt: -1
    })

    if (!lastUserLogin) {
      await Login.create({ status, user: user.uuid, provider })
      return
    }

    if (lastUserLogin.status === status) return

    await Login.create({ status, user: user.uuid, provider })
  } catch (error) {
    LogController.sendError(error)
  }
}

const formatPayload = ({ message, messageOptions }) => {
  try {
    const reactions = formatReactions({ message, messageOptions })

    const payload = {
      content: message.msg,
      createdAt: moment(message.ts.$date).toDate(),
      updatedAt: moment(message._updatedAt.$date).toDate(),
      threadCount: message.tcount || 0,
      reactionCount: reactions.length,
      reactions,
      mentions: message.mentions,
      channels: message.channels,

      provider: {
        name: providers.rocketchat,
        messageId: message._id,
        parentId: message.tmid,
        room: {
          id: message.rid,
          name: messageOptions.roomName
        },
        user: {
          id: message.u._id,
          username: message.u.username
        }
      }
    }
    removeEmptyValues(payload)
    return payload
  } catch (error) {
    throw Error(error)
  }
}

const formatReactions = ({ message, messageOptions }) => {
  const reactions = []
  if (!message.reactions) return reactions

  for (const reaction of Object.entries(message.reactions)) {
    for (const username of reaction[1].usernames) {
      reactions.push({
        content: reaction[0],
        provider: {
          name: providers.rocketchat,
          messageId: message._id,
          room: {
            id: message.rid,
            name: messageOptions.roomName
          },
          username
        }
      })
    }
  }
  return reactions
}
