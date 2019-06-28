import errors from '../errors'
import users from '../users'
import ranking from '../rankings'
import rankingUtils from '../rankings/rankingsUtils'

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

const getRankingByMonth = async (month, team) => {
  try {
    if (!(await rankingUtils.isValidMonth(month)))
      return { error: 'Envie um mês válido Ex: /miner/ranking/mes/1' }

    return ranking.getRankingByMonth(month, team)
  } catch (e) {
    errors._throw(file, 'getRankingByMonth', e)
  }
}

export default {
  getGeneralRanking,
  getRankingByMonth,
  getAllUsers
}
