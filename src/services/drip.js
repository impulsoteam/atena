import { achievementTypes } from '../config/achievements'
import LogController from '../controllers/LogController'
import ScoreController from '../controllers/ScoreController'
import { scoreTypes } from '../models/Score/schema'

export const handleEvent = async (req, res) => {
  try {
    const { event, data, occurred_at } = req.body
    const { subscriber, properties } = data
    const { source, email_id, email_subject, email_name } = properties

    const dripEvents = {
      'subscriber.opened_email': {
        scoreType: scoreTypes.newsletterRead,
        achievementType: achievementTypes.newslettersRead
      }
    }
    const { scoreType, achievementType } = dripEvents[event]
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
