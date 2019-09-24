import rocket from '../rocket'
import users from '../users'
import { generateStoryTelling } from './storingTelling'

const notAllowedChannels = [
  'apresente-se',
  'oportunidades ',
  'comunicados',
  'meetup',
  'beneficios-network',
  'duvidas'
]

const sendToUser = (message, user) => {
  return rocket.sendMessageToUser(message, user)
}

const sendToRoom = async (message, room = 'comunicados') => {
  if (notAllowedChannels.includes(room)) return

  return await rocket.sendMessageToRoom(message, room)
}

const routeMessageToUserOrRoom = async rawMessage => {
  const isCoreTeam = await users.isCoreTeam(rawMessage.u._id)

  if (!isCoreTeam) return

  const message = rawMessage.msg
    .split('\n')
    .slice(1)
    .join('\n')

  const userMessages = rawMessage.mentions.map(user => {
    return rocket.sendMessageToUser(message, user.username)
  })

  const channelMessages = rawMessage.channels.map(channel => {
    return rocket.sendMessageToRoom(message, channel.name)
  })

  return Promise.all([...userMessages, ...channelMessages])
}

const sendStoryTelling = ({ level, username }) => {
  const message = generateStoryTelling(level, username)
  setTimeout(() => {
    sendToUser(message, username)
  }, 10000)
}

export default {
  sendToUser,
  sendToRoom,
  sendStoryTelling,
  routeMessageToUserOrRoom
}
