import { driver } from '@rocket.chat/sdk'

import LogController from '../../controllers/LogController'
import { handleUserStatus, handlePayload } from './handler'

export const connect = async () => {
  try {
    await driver.connect()

    await driver.login()

    await driver.subscribeToMessages()
    driver.reactToMessages((error, message, messageOptions) => {
      if (error)
        return LogController.sendNotify({
          type: 'error',
          file: 'services/rocketchat/driver.js - reactToMessages',
          resume: 'Received error instead of message',
          details: error
        })
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
    LogController.sendNotify({
      type: 'error',
      file: 'services/rocketchat.connect',
      resume: 'Error while connecting',
      details: error
    })
  }
}
