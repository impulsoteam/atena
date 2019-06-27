import ranking from '../rankings'

const getGeneralRanking = async (team, limit) => {
  return ranking.getGeneralRanking(team, limit)
}

export default {
  getGeneralRanking
}
