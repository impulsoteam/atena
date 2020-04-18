import { driver } from '@rocket.chat/sdk'

import LogController from '../../controllers/LogController'
import { handleUserStatus, handlePayload } from './handler'

export const connect = async () => {
  try {
    await driver.connect()

    const botId = await driver.login()

    await driver.subscribeToMessages()
    driver.reactToMessages((error, message, messageOptions) => {
      if (error)
        return LogController.sendError({
          file: 'services/rocketchat/driver.js - reactToMessages',
          resume: 'Received error instead of message',
          details: error
        })

      if (message.u._id === botId) return

      handlePayload({ message, messageOptions })
    })

    await driver.subscribe('stream-notify-logged', 'user-status')
    const userStatusCollection = driver.asteroid.getCollection(
      'stream-notify-logged'
    )

    userStatusCollection.reactiveQuery({}).on('change', function(_id) {
      const query = userStatusCollection.reactiveQuery({ _id }).result[0]
        .args[0]
      const [rocketId, username, status] = query
      handleUserStatus({ rocketId, username, status })
    })
  } catch (error) {
    LogController.sendError(error)
  }
}

export const sendMessage = ({ room, username, message }) => {
  username && sendMessageToUser({ user: username, message })
  room && sendMessageToRoom({ room, message })
}

const sendMessageToUser = async ({ message, user }) => {
  try {
    await driver.sendDirectToUser(message, user)
  } catch (error) {
    LogController.sendError(error)
  }
}
const sendMessageToRoom = async (message, room) => {
  try {
    return await driver.sendToRoom(message, room)
  } catch (error) {
    LogController.sendError(error)
  }
}
