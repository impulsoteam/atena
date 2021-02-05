import { scheduleJob } from 'node-schedule'

import BotController from '../controllers/BotController'
import RankingController from '../controllers/RankingController'
import UserController from '../controllers/UserController'
import { inviteUserToNotJoinedChannels } from '../services/rocketchat/api'

export const scheduleJobs = () => {
  scheduleJob('0 0 * * *', inviteUserToNotJoinedChannels)
  scheduleJob('0 1 * * *', UserController.updateEmailServices)
  scheduleJob('0 0 1 * * *', RankingController.resetMonthlyRanking)
  scheduleJob('30 13 * * mon', BotController.sendMonthlyRankingToChannel)
  scheduleJob('00,20,40 * * * *', RankingController.createMonthlyRanking)
  scheduleJob('10,30,50 * * * *', RankingController.createGeneralRanking)
}
