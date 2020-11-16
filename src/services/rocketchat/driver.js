import { driver } from '@rocket.chat/sdk'
import { sendError } from 'log-on-slack'

import { handleUserStatus, handlePayload } from './handler'

export const connect = async () => {
  try {
    await driver.connect()

    const botId = await driver.login()

    await driver.subscribeToMessages()
    driver.reactToMessages((error, messages, messageOptions) => {
      if (error) throw new Error('Error in driver.reactToMessages')

      const message = messages[0] || messages
      if ((message.u && message.u._id === botId) || message.t) return

      handlePayload({ message, messageOptions })
    })

    await driver.subscribe('stream-notify-logged', 'user-status')
    const userStatusCollection = driver.asteroid.getCollection(
      'stream-notify-logged'
    )

    userStatusCollection.reactiveQuery({}).on('change', function (_id) {
      const query = userStatusCollection.reactiveQuery({ _id }).result[0]
        .args[0]

      const [id] = query
      handleUserStatus(id)
    })
  } catch (error) {
    sendError({
      file: 'services/rocketchat/driver.js - connect',
      error
    })
    process.exit(1)
  }
}

export const sendMessage = ({ channel, username, message }) => {
  username && sendMessageToUser({ user: username, message })
  channel && sendMessageToRoom({ channel, message })
}

const sendMessageToUser = async ({ message, user }) => {
  try {
    await driver.sendDirectToUser(message, user)
  } catch (error) {
    sendError({
      file: 'services/rocketchat/driver.js - sendMessage',
      payload: { message, user },
      error
    })
  }
}
const sendMessageToRoom = async ({ message, channel }) => {
  try {
    return await driver.sendToRoom(message, channel)
  } catch (error) {
    sendError({
      file: 'services/rocketchat/driver.js - sendMessageToRoom',
      payload: { message, channel },
      error
    })
  }
}
