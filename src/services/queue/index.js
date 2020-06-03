import Queue from 'bull'

import AchievementController from '../../controllers/AchievementController'
import LogController from '../../controllers/LogController'
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
    LogController.sendError(error)
  } finally {
    done(null, 'interaction send to be processed')
  }
})

sendProfileCompletenessToQueue.process(async function (job, done) {
  try {
    await AchievementController.handleProfileCompleteness(job.data)
  } catch (error) {
    LogController.sendError(error)
  } finally {
    done(null, 'interaction send to be processed')
  }
})

export { sendInteractionToQueue, sendProfileCompletenessToQueue }
