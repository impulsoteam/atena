import { driver, api } from '@rocket.chat/sdk'
import { getOr } from 'lodash/fp'
import service from './rocketService'
import errors from '../errors'
import commands from '../commands'
import settings from '../settings'
import interactions from '../interactions'

const file = 'Rocket | Controller'
let BOT_ID
let API_ID

const exec = async () => {
  BOT_ID = await service.runBot(handle)
  API_ID = await service.runAPI()
}

const handle = async (error, message, messageOptions) => {
  if (error) {
    errors._throw(file, 'handle', error)
    return
  }

  console.log('MESSAGE: ', message, messageOptions)
  message.origin = 'rocket'

  try {
    if (!message.reactions) await commands.handle(message)
    if (!service.isValidMessage(BOT_ID, message, messageOptions)) return

    await interactions.handle({
      ...message,
      ...messageOptions
    })
  } catch (e) {
    errors._throw(file, 'handle', e)
    const data = new Date(message.ts['$date']).toLocaleDateString('en-US')
    errors._log(
      file,
      'handle',
      `${message.u.name} (${message.u._id}) - ${data}`
    )
  }
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
    console.log(`Send message to room ${room}: \n ${message}`)
    return driver.sendToRoom(message, room)
  } catch (e) {
    errors._throw(file, 'sendMessageToRoom', e)
  }
}

const sendMessageToUser = (message, user) => {
  try {
    console.log(`Send message to ${user}: \n ${message}`)
    return driver.sendDirectToUser(message, user)
  } catch (e) {
    errors._throw(file, 'sendMessageToUser', e)
  }
}

const normalize = data => {
  return service.convertToInteraction(data)
}

const getDailyLimit = async () => {
  const setting = await settings.getValue('rocket_daily_limit')
  return setting.value || false
}

const findOrCreateUser = async interaction => {
  const rocketUser = await getUserInfo(interaction.user)
  return await service.findOrCreateUser(rocketUser)
}

const isFlood = interaction => {
  return service.isFlood(interaction)
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
  exec
}
