import rocket from '../rocket'

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

export default {
  sendToUser,
  sendToRoom
}
