import rocket from '../rocket'

const notAllowedChannels = [
  'impulso-network',
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

const sendToRoom = (message, room = 'comunicados') => {
  if (notAllowedChannels.includes(room)) return

  return rocket.sendMessageToRoom(message, room)
}

export default {
  sendToUser,
  sendToRoom
}
