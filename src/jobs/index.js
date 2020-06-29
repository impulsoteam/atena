import cron from 'node-cron'

import BotController from '../controllers/BotController'
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

const sendUsersToDrip = () => {
  cron.schedule('0 4 * * *', () => UserController.sendUsersToDrip())
}

export const exec = () => {
  chatInactivities()
  sendMonthlyRankingToChannel()
  inviteUsersToChannel()
  sendUsersToDrip()
}
