import rocket from '../rocket'

const sendToUser = (message, user) => {
  return rocket.sendMessageToUser(message, user)
}

const sendToRoom = (message, room = 'comunicados') => {
  return rocket.sendMessageToRoom(message, room)
}

export default {
  sendToUser,
  sendToRoom
}
