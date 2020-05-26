import { products } from '../../config/achievements/clickOnProduct'
import LogController from '../../controllers/LogController'
import ScoreController from '../../controllers/ScoreController'
import UserController from '../../controllers/UserController'
import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import { sendInteractionToQueue } from '../../services/queue'
import { removeEmptyValues } from '../../utils'

export const handlePayload = async ({ message, channel }) => {
  try {
    const { content, properties } = message
    const data = JSON.parse(content.toString())
    const types = {
      Impulser: handleUser,
      'Ahoy::Event': handleEvent
    }

    const service = types[properties.type]

    if (service) await service(data)
  } catch (error) {
    LogController.sendError(error)
  } finally {
    channel.ack(message)
  }
}

const handleUser = async data => {
  if (data.status === 'archived') return UserController.delete(data)

  const {
    uuid,
    fullname,
    email,
    rocket_chat,
    linkedin,
    google,
    photo_url
  } = data

  const user = {
    uuid,
    name: fullname,
    email,
    avatar: photo_url,
    rocketchat: {
      id: rocket_chat.id,
      username: rocket_chat.username
    },
    linkedin: { id: linkedin.uid },
    google: { id: google.uid }
  }

  removeEmptyValues(user)
  return UserController.handle(user)
}

const handleEvent = async data => {
  const { properties, impulser_uuid, time } = data

  if (!properties.name || !Object.keys(products).includes(properties.name))
    return

  if (!impulser_uuid || !time)
    return LogController.sendError({
      file: 'services/amqp/handler - handleEvent',
      resume: `Payload with missing values`,
      details: { payload: data }
    })

  const achievementType = products[properties.name]
  const payload = {
    uuid: impulser_uuid,
    achievementType,
    provider: { name: 'impulser.app' },
    description: scoreTypes.clickOnProduct,
    product: achievementType,
    time
  }

  const user = await User.findOne({ uuid: payload.uuid })

  if (!user) {
    return sendInteractionToQueue.add(payload, {
      delay: 600000,
      removeOnComplete: true
    })
  }
  await ScoreController.handleClickOnProduct(payload)
}
