import { driver } from '@rocket.chat/sdk'
import errors from '../errors'
import commands from '../commands'
import interactions from '../interactions'
import service from './rocketService'

const file = 'Rocket | Controller'
let BOT_ID
const exec = async () => {
  await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl:
      process.env.ROCKET_SSL === true || /true/i.test(process.env.ROCKET_SSL)
  })

  BOT_ID = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  })

  await driver.subscribeToMessages()
  await driver.reactToMessages(handle)
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

    //   await interactions.process({
    //     ...message,
    //     ...messageOptions
    //   })
  } catch (e) {
    errors._throw(file, 'handle', e)
    const data = new Date(message.ts['$date']).toLocaleDateString('en-US')
    errors._log(
      file,
      'handle',
      `ID ${message.u._id} - NAME ${message.u.name} - ${data}`
    )
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

export default {
  sendMessageToUser,
  sendMessageToRoom,
  exec
}
