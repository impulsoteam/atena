import { api } from '@rocket.chat/sdk'
import { levelsList } from '../../config/score'
import {
  getUserInfoByUsername,
  getChannelsList,
  getUserChannelsList,
  inviteUserToChannel
} from '../axios'
import LogController from '../../controllers/LogController'

export const connect = async () => {
  try {
    await api.login()
  } catch (error) {
    LogController.sendError(error)
  }
}

export const getPreviousMessage = async ({ roomId }) => {
  const { success, messages } = await api.get('channels.history', {
    roomId,
    count: 2
  })
  if (!success || !messages[1]) return false

  const { u, ts } = messages[1]
  return {
    user: u._id,
    createdAt: ts
  }
}

export const updateBadge = async ({ level, id }) => {
  try {
    const badges = levelsList().map(({ badge }) => badge)
    const { user } = await api.get(`users.info?userId=${id}`)

    const roles = user.roles.filter(role => !badges.includes(role))
    const newRole = badges[level - 1] || badges[0]
    roles.push(newRole)

    await api.post(`users.update`, {
      userId: id,
      data: { roles }
    })
  } catch (error) {
    LogController.sendError(error)
  }
}

export const getUserInfo = async id => {
  try {
    const { user } = await api.get(`users.info?userId=${id}`)
    return user
  } catch (error) {
    LogController.sendError(error)
  }
}

export const inviteUserToNotJoinedChannels = async () => {
  try {
    const users = process.env.USERS_TO_INVITE.split('|')

    for (const username of users) {
      const user = await getUserInfoByUsername(username)
      const userChannels = await getUserChannelsList(username)
      const allChannels = await getChannelsList()

      const userChannelsNames = userChannels.map(channel => channel.name)
      const channelsNotIn = allChannels.filter(
        channel => !userChannelsNames.includes(channel.name)
      )
      for (const channel of channelsNotIn) {
        await inviteUserToChannel(user._id, channel._id, channel.t)
      }
    }
  } catch (error) {
    LogController.sendError(error)
  }
}
