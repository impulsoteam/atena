import service from './rankingsService'
import utils from './rankingsUtils'
import users from '../users'

const calculatePositionByUser = async (userId, isCoreTeam) => {
  return service.calculatePositionByUser(userId, isCoreTeam)
}

const commandGeneral = async message => {
  const coreTeam = await users.isCoreTeam(message.u._id)
  return service.getGeneralRanking(message.u._id, coreTeam)
}

const commandByMonth = async message => {
  const month = utils.getMonthFromMessage(message)
  return await service.getRankingByMonth(message.u._id, month)
}

export default {
  calculatePositionByUser,
  commandGeneral,
  commandByMonth
}
