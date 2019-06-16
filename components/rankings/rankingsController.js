import service from './rankingsService'
import users from '../users'

const calculatePositionByUser = async (userId, isCoreTeam) => {
  return service.calculatePositionByUser(userId, isCoreTeam)
}

const commandGeneral = async message => {
  let response = {}

  try {
    const coreTeam = await users.isCoreTeam(message.u._id)
    response = await service.getGeneralRanking(message.u._id, coreTeam)
  } catch (e) {
    console.log(e)
  }

  return response
}

export default {
  calculatePositionByUser,
  commandGeneral
}
