import LogController from '../../controllers/LogController'
import ScoreController from '../../controllers/ScoreController'
import User from '../../models/User'
import { sendProfileCompletenessToQueue } from '../../services/queue'

export const handle = async ({ message, channel }) => {
  try {
    const { content, properties } = message
    const data = JSON.parse(content.toString())
    const types = {
      profileChange: handleProfileCompleteness
    }

    const service = types[properties.type]

    if (service) await service(data)
  } catch (error) {
    LogController.sendError(error)
  } finally {
    channel.ack(message)
  }
}

const handleProfileCompleteness = async data => {
  try {
    const payload = {
      ...data,
      provider: 'impulser.app'
    }
    const user = await User.findOne({ uuid: data.uuid })

    if (!user) {
      return sendProfileCompletenessToQueue.add(payload, {
        delay: 600000,
        removeOnComplete: true
      })
    }
    await ScoreController.handleProfileCompleteness(payload)
  } catch (error) {
    LogController.sendError(error)
  }
}
