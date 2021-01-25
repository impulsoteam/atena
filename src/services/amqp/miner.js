import { sendError } from 'log-on-slack'

import { achievementTypes } from '../../config/achievements'
import AchievementController from '../../controllers/AchievementController'
import ScoreController from '../../controllers/ScoreController'
import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import { sendInteractionToQueue } from '../../services/queue'

export const handle = async ({ message, channel }) => {
  try {
    const { content, properties } = message
    const data = JSON.parse(content.toString())
    const types = {
      emailOpened: handleEmailOpenedInteraction,
      subscribedToMeetup: handleMeetupSubscription
    }

    const service = types[properties.type]
    if (service) await service(data)
  } catch (error) {
    sendError({
      file: 'services/amqp/miner - handle',
      payload: { message, channel },
      error
    })
  } finally {
    channel.ack(message)
  }
}

const handleMeetupSubscription = async ({ uuid, meetup }) => {
  const user = await User.findOne({ uuid })

  if (!user) return

  const updatedUser = await ScoreController.handleMeetupSubscription({
    user,
    meetup
  })

  await AchievementController.handle({
    user: updatedUser,
    achievementType: achievementTypes.subscribedToMeetup
  })
}

const handleEmailOpenedInteraction = async payload => {
  try {
    const { email: emailDetails, userEmail } = payload
    const { source, subject, name, type, occurredAt } = emailDetails

    if (!['Broadcast', 'Campaign'].includes(type)) return
    const dripEvents = {
      'newsletter impulso network': {
        scoreType: scoreTypes.newsletterRead,
        achievementType: achievementTypes.newslettersRead
      }
    }

    let scoreType, achievementType

    for (const [event, types] of Object.entries(dripEvents)) {
      const emailName = name.toLowerCase()

      if (emailName.includes(event)) {
        scoreType = types.scoreType
        achievementType = types.achievementType

        break
      }
    }

    if (!scoreType || !achievementType) return

    const interaction = {
      scoreType,
      achievementType,
      queries: {
        user: { email: userEmail },
        details: { 'details.email.subject': subject }
      },
      details: {
        email: {
          name,
          subject
        },
        provider: source,
        occurredAt
      }
    }

    sendInteractionToQueue.add(interaction, { removeOnComplete: true })
  } catch (error) {
    sendError({
      file: 'services/amqp/miner - handleEmailOpenedInteraction',
      payload,
      error
    })
  }
}
