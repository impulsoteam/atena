import Queue from 'bull'

import ScoreController from '../../controllers/ScoreController'

const sendInteractionToQueue = new Queue(
  'sendInteractionToQueue',
  process.env.REDIS_URL
)

sendInteractionToQueue.process(async function (job, done) {
  ScoreController.handleClickOnProduct(job.data)
  done(null, 'interaction send to be processed')
})

export { sendInteractionToQueue }
