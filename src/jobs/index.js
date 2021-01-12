import cron from 'node-cron'

import BotController from '../controllers/BotController'
import RankingController from '../controllers/RankingController'
import UserController from '../controllers/UserController'
import { inviteUserToNotJoinedChannels } from '../services/rocketchat/api'

const sendMonthlyRankingToChannel = () => {
  cron.schedule('30 13 * * mon', () =>
    BotController.sendMonthlyRankingToChannel()
  )
}

const inviteUsersToChannel = () => {
  cron.schedule('0 0 * * *', () => inviteUserToNotJoinedChannels())
}

const updateEmailServices = () => {
  cron.schedule('0 1 * * *', () => UserController.updateEmailServices())
}

const resetMonthlyRanking = () => {
  cron.schedule('0 0 1 * * *', () => RankingController.resetMonthlyRanking())
}

const updateMonthlyRanking = () => {
  cron.schedule('00,20,40 * * * *', () =>
    RankingController.createMonthlyRanking()
  )
}

const updateGeneralRanking = () => {
  cron.schedule('10,30,50 * * * *', () =>
    RankingController.createGeneralRanking()
  )
}

export const exec = () => {
  sendMonthlyRankingToChannel()
  inviteUsersToChannel()
  updateEmailServices()
  resetMonthlyRanking()
  updateMonthlyRanking()
  updateGeneralRanking()
  inviteUsersToChannel()
  sendMonthlyRankingToChannel()
}
