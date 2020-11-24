import cron from 'node-cron'

import BotController from '../controllers/BotController'
import RankingController from '../controllers/RankingController'
import ScoreController from '../controllers/ScoreController'
import UserController from '../controllers/UserController'
import { inviteUserToNotJoinedChannels } from '../services/rocketchat/api'

const chatInactivities = () => {
  cron.schedule('0 3 * * *', () => ScoreController.scoreInactivities())
}

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

const updateMonthlyRanking = () => {
  cron.schedule('00,30 * * * *', () => RankingController.createMonthlyRanking())
}

const updateGeneralRanking = () => {
  cron.schedule('10,40 * * * *', () => RankingController.createGeneralRanking())
}

export const exec = () => {
  chatInactivities()
  updateEmailServices()
  updateMonthlyRanking()
  updateGeneralRanking()
  inviteUsersToChannel()
  sendMonthlyRankingToChannel()
}
