import { driver, api } from '@rocket.chat/sdk'
import { getOr } from 'lodash/fp'
import moment from 'moment-timezone'
import config from 'config-yml'
import service from './rocketService'
import errors from '../errors'
import logs from '../logs'
import commands from '../commands'
import settings from '../settings'
import interactions from '../interactions'
import users from '../users'
import crypto from '../crypto'
import axiosApi from '../axios'
import inviteUserToChannelQueue from '../queues/inviteUserToChannelQueue'
import userStatusChangeQueue from '../queues/userStatusChangeQueue'

const file = 'Rocket | Controller'
let BOT_ID

const exec = async () => {
  BOT_ID = await service.runBot(handleMessages, handleUserStatus)
  await service.runAPI()
}

const handleMessages = async (error, message, messageOptions) => {
  if (error) {
    errors._throw(file, 'handle', error)
    return
  }

  try {
    if (messageOptions.roomType === 'd') await commands.handle(message)
    const isValidMessage = await service.isValidMessage(
      BOT_ID,
      message,
      messageOptions
    )

    if (!isValidMessage) return

    const data = {
      origin: 'rocket',
      ...message,
      ...messageOptions
    }

    logs.info('MESSAGE: ', data)

    await interactions.handle(data)
    if (!message.reactions && !message.replies) await commands.handle(message)
  } catch (e) {
    const data = new Date(message.ts['$date']).toLocaleDateString('en-US')
    const text = `${e.message} - ${message.u.name} (${message.u._id}) - ${data}`
    errors._throw(file, 'handleMessage', text)
  }
}

const handleUserStatus = async ({ rocketId, username }) => {
  userStatusChangeQueue.add({ rocketId, username })
}

const getUserInfo = async userId => {
  try {
    const result = await api.get('users.info', { userId: userId })
    return getOr(false, 'user', result)
  } catch (e) {
    errors._throw(file, 'getUserInfo', e)
    return false
  }
}

const getUserInfoByUsername = async username => {
  try {
    const result = await api.get('users.info', { username: username })
    return getOr(false, 'user', result)
  } catch (e) {
    errors._throw(file, 'getUserInfoByUsername', e)
    return false
  }
}

const getHistory = async roomId => {
  try {
    const result = await api.get('channels.history', {
      roomId: roomId,
      count: 8000
    })

    return result.messages
  } catch (e) {
    errors._throw(file, 'getHistory', e)
  }
  return false
}

const getChannels = async () => {
  try {
    const result = await api.get('channels.list', { count: 400 })
    return result.channels
  } catch (e) {
    errors._throw(file, 'getChannels', e)
    return false
  }
}

const sendMessageToRoom = (message, room) => {
  try {
    return driver.sendToRoom(message, room)
  } catch (e) {
    errors._throw(file, 'sendMessageToRoom', e)
  }
}

const auth = async (username, password) => {
  try {
    const login = await api.post('login', {
      user: username,
      password: password
    })

    if (login && login.status === 'success') {
      const user = await users.findOne({ rocketId: login.data.userId })
      if (!user) {
        return { error: 'Usuário não encontrado na Atena' }
      }

      const expireAt = process.env.ATENA_EXPIRE_TOKEN
      const data = {
        avatar: user.avatar || '',
        uuid: user.uuid || '',
        isCoreTeam: user.isCoreTeam || false,
        expireAt: moment()
          .add(expireAt, 'minutes')
          .format()
      }

      const token = await crypto.encrypt(data)
      return { token }
    } else {
      return { error: 'Usuário não encontrado no Rocket.Chat' }
    }
  } catch (e) {
    errors._throw(file, 'auth', e)
    return { error: 'Erro ao acessar Rocket.Chat auth' }
  }
}

const sendMessageToUser = (message, user) => {
  try {
    return driver.sendDirectToUser(message, user)
  } catch (e) {
    errors._throw(file, 'sendMessageToUser', e)
  }
}

const normalize = data => {
  return service.convertToInteraction(data)
}

const getDailyLimit = async () => {
  return settings.getValue('rocket_daily_limit')
}

const findOrCreateUser = async interaction => {
  const rocketUser = await getUserInfo(interaction.rocketId)
  return await service.findOrCreateUser(rocketUser)
}

const isFlood = interaction => {
  return service.isFlood(interaction)
}

const inviteUserToNotJoinedChannels = async username => {
  const [user, userChannels, allChannels] = await Promise.all([
    axiosApi.adminUserApi.getUserInfoByUsername(username),
    axiosApi.adminUserApi.getUserChannelsList(username),
    axiosApi.adminUserApi.getChannelsList()
  ])

  const userChannelsNames = userChannels.map(channel => channel.name)
  const channelsNotIn = allChannels.filter(
    channel => !userChannelsNames.includes(channel.name)
  )

  const promises = channelsNotIn.map((channel, index) => {
    return inviteUserToChannelQueue.add(
      {
        userId: user._id,
        roomId: channel._id,
        type: channel.t
      },
      {
        delay: index * 10000
      }
    )
  })

  return Promise.all(promises)
}

const updateLevelRole = async ({ level, rocketId }) => {
  const badges = config.levelrules.levels_badges
  const { user } = await api.get(`users.info?userId=${rocketId}`)

  const roles = user.roles.filter(role => !badges.includes(role))
  let newRole = badges[level - 1] || badges[0]
  roles.push(newRole)

  api.post(`users.update`, {
    userId: rocketId,
    data: { roles }
  })
}

export default {
  sendMessageToUser,
  sendMessageToRoom,
  getUserInfo,
  getUserInfoByUsername,
  getHistory,
  getChannels,
  findOrCreateUser,
  normalize,
  getDailyLimit,
  isFlood,
  auth,
  inviteUserToNotJoinedChannels,
  updateLevelRole,
  exec
}
