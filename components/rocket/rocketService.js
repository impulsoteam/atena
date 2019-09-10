import config from 'config-yml'
import moment from 'moment-timezone'
import { driver, api } from '@rocket.chat/sdk'
import users from '../users'
import interactions from '../interactions'

const isValidMessage = async (botId, message, messageOptions) => {
  const exists = await interactions.messageExists(message._id)
  const conditions = !(
    exists ||
    message.u._id === botId ||
    message.t ||
    messageOptions.roomType === 'd' ||
    message.bot != undefined
  )

  return Promise.resolve(conditions)
}

const convertToInteraction = data => {
  const dateMessage = data.history
    ? new Date(data.ts).toLocaleString('en-US')
    : new Date(data.ts['$date'])

  let response = {
    origin: 'rocket',
    category: config.categories.network.type,
    channel: data.rid,
    channelName: data.roomName || null,
    date: dateMessage,
    type: 'message'
  }

  if (data.reactions) {
    const reactions = data.reactions
    response = {
      ...response,
      description: Object.keys(reactions).pop(),
      parentUser: null,
      rocketId: data.u._id,
      action: config.actions.reaction.type,
      score: 0
    }
  } else {
    if (data.attachments) {
      data.msg = 'attachment'
    }

    response = {
      ...response,
      description: data.msg,
      rocketId: data.u._id,
      username: data.u.name,
      rocketUsername: data.u.username,
      action: config.actions.message.type,
      score: config.xprules.messages.send
    }
  }

  return response
}

const runAPI = async () => {
  return await api.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  })
}

const runBot = async handle => {
  await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl:
      process.env.ROCKET_SSL === true || /true/i.test(process.env.ROCKET_SSL)
  })

  const BOT_ID = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  })

  await driver.subscribeToMessages()
  await driver.reactToMessages(handle)

  return BOT_ID
}

const findOrCreateUser = async rocketUser => {
  if (!rocketUser) return false
  const email = rocketUser.emails[0].address
  const query = {
    $or: [{ rocketId: rocketUser._id }, { email: email }]
  }

  const args = {
    $set: {
      name: rocketUser.name,
      rocketId: rocketUser._id,
      username: rocketUser.username,
      email: email
    },
    $setOnInsert: {
      level: 1,
      score: 0
    }
  }

  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }

  return users.findOneAndUpdate(query, args, options)
}

const isFlood = async interaction => {
  const lastMessage = await interactions.getLastMessage(interaction.user)
  const lastDate = lastMessage ? lastMessage.date : 0

  return (
    interaction.type === 'message' &&
    moment(interaction.date).diff(lastDate, 'seconds') <
      config.xprules.limits.flood
  )
}

export default {
  runBot,
  runAPI,
  isValidMessage,
  convertToInteraction,
  findOrCreateUser,
  isFlood
}
