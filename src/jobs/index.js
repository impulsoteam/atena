import { scheduleJob } from 'node-schedule'

import RankingController from '../controllers/RankingController'
import UserController from '../controllers/UserController'

export const scheduleJobs = () => {
  scheduleJob('0 1 * * *', UserController.updateEmailServices)
  scheduleJob('0 0 1 * *', RankingController.resetMonthlyRanking)
  scheduleJob('00,20,40 * * * *', RankingController.createMonthlyRanking)
  scheduleJob('10,30,50 * * * *', RankingController.createGeneralRanking)
}
