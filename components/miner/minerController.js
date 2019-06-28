import errors from '../errors'
import users from '../users'
import ranking from '../rankings'

const file = 'Miner | Controller'

const getAllUsers = async (team, limit) => {
  try {
    const allUsers = await users.find(
      { teams: { $all: [team] } },
      { score: -1 }
    )

    return allUsers.map(user => {
      user.score = parseInt(user.score)
      return user
    })
  } catch (e) {
    errors._throw(file, 'getAllUsers', e)
  }
}

const getGeneralRanking = async (team, limit) => {
  try {
    return ranking.getGeneralRanking(team, limit)
  } catch (e) {
    errors._throw(file, 'getGeneralRanking', e)
  }
}

export default {
  getGeneralRanking,
  getAllUsers
}
