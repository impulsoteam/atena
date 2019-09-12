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

const routeMessageToUserOrRoom = (rawMessage, regex) => {
  const [_, destination, message] = new RegExp(regex).exec(rawMessage)
  const handler =
    destination[0] === '#' ? rocket.sendMessageToRoom : rocket.sendMessageToUser

  return handler(message, destination.slice(1))
}

export default {
  sendToUser,
  sendToRoom,
  routeMessageToUserOrRoom
}
