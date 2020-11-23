import cron from 'node-cron'

import BotController from '../controllers/BotController'
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

export const exec = () => {
  sendMonthlyRankingToChannel()
  inviteUsersToChannel()
  updateEmailServices()
}
