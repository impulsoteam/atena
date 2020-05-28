import { achievementTypes } from '../config/achievements'
import LogController from '../controllers/LogController'
import ScoreController from '../controllers/ScoreController'
import { scoreTypes } from '../models/Score/schema'

export const handleEvent = async (req, res) => {
  try {
    const { data, occurred_at } = req.body
    const { subscriber, properties } = data
    const {
      source,
      email_id,
      email_subject,
      email_name,
      email_type
    } = properties

    if (email_type !== 'Broadcast')
      return res.json({ message: 'Email not eligible for scoring' })

    const dripEvents = {
      'newsletter impulso network': {
        scoreType: scoreTypes.newsletterRead,
        achievementType: achievementTypes.newslettersRead
      }
    }

    let scoreType, achievementType

    for (const [event, types] of Object.entries(dripEvents)) {
      const emailName = email_name.toLowerCase()

      if (emailName.includes(event)) {
        scoreType = types.scoreType
        achievementType = types.achievementType

        break
      }
    }

    if (!scoreType || !achievementType)
      return res.json({ message: 'Email not eligible for scoring' })

    await ScoreController.handleExternalInteraction({
      scoreType,
      achievementType,
      query: { email: subscriber.email },
      details: {
        email: {
          id: email_id,
          name: email_name,
          subject: email_subject
        },
        provider: source,
        occurredAt: occurred_at
      }
    })

    res.json({ message: 'Event sent to be processed' })
  } catch (error) {
    res.json({ error: error.toString() })
    LogController.sendError({
      file: 'services/drip.js - handleEvent',
      resume: error.toString(),
      details: { payload: req.body }
    })
  }
}
