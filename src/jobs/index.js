import cron from 'node-cron'

import BotController from '../controllers/BotController'
import ScoreController from '../controllers/ScoreController'
import { inviteUserToNotJoinedChannels } from '../services/rocketchat/api'

const chatInactivities = async () => {
  cron.schedule('0 3 * * *', () => ScoreController.scoreInactivities())
}

const sendMonthlyRankingToChannel = () => {
  cron.schedule('30 13 * * mon', () =>
    BotController.sendMonthlyRankingToChannel()
  )
}

const inviteUsersToChannel = () => {
  cron.schedule('0 0 * * *', async () => inviteUserToNotJoinedChannels())
}

export const exec = () => {
  chatInactivities()
  sendMonthlyRankingToChannel()
  inviteUsersToChannel()
}
