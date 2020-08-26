import Queue from 'bull'
import { sendError } from 'log-on-slack'

import ScoreController from '../../controllers/ScoreController'

const sendInteractionToQueue = new Queue(
  'sendInteractionToQueue',
  process.env.REDIS_URL
)

const sendProfileCompletenessToQueue = new Queue(
  'sendProfileCompletenessToQueue',
  process.env.REDIS_URL
)

sendInteractionToQueue.process(async function (job, done) {
  try {
    await ScoreController.handleExternalInteraction(job.data)
  } catch (error) {
    sendError({
      file: 'services/queue/index.js - sendInteractionToQueue',
      payload: { ...job.data },
      error
    })
  } finally {
    done(null, 'interaction send to be processed')
  }
})

sendProfileCompletenessToQueue.process(async function (job, done) {
  try {
    await ScoreController.handleProfileCompleteness(job.data)
  } catch (error) {
    sendError({
      file: 'services/queue/index.js - sendProfileCompletenessToQueue',
      payload: { ...job.data },
      error
    })
  } finally {
    done(null, 'interaction send to be processed')
  }
})

export { sendInteractionToQueue, sendProfileCompletenessToQueue }
