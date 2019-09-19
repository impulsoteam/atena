import errors from '../errors'
import users from '../users'
import ranking from '../rankings'
import rankingUtils from '../rankings/rankingsUtils'

const file = 'Miner | Controller'

const getAllUsers = async team => {
  try {
    const allUsers = await users.find(
      {
        teams: { $in: [team] },
        rocketId: { $ne: null },
        score: { $gt: 0 },
        isCoreTeam: false
      },
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

const getGeneralRanking = async ({ page, limit }) => {
  try {
    return await ranking.getGeneralRanking({ page, limit })
  } catch (e) {
    errors._throw(file, 'getGeneralRanking', e)
  }
}

const getMonthlyRanking = async ({ page, limit }) => {
  try {
    return ranking.getMonthlyRanking({ page, limit })
  } catch (e) {
    errors._throw(file, 'getRankingByMonth', e)
  }
}

const getMostActiveUsers = async (begin, end) => {
  let response = {
    text: '',
    attachments: []
  }

  const allUsers = await users.getMostActives(begin, end)

  if (allUsers.error) return { error: allUsers.error }

  response.text = `Total de ${allUsers.length} usuário engajados`

  allUsers.forEach(user => {
    const usernameText = user._id.username
      ? `Username: @${user._id.username} | `
      : ''
    const nameText = user._id.name ? `Name: ${user._id.name} | ` : ''

    const rocketIdText = user._id.rocketId
      ? `Rocket ID: ${user._id.rocketId} | `
      : ''

    response.attachments.push({
      text: `${usernameText}${nameText}${rocketIdText}Qtd. interações: ${user.count}`
    })
  })

  return response
}

export default {
  getGeneralRanking,
  getMonthlyRanking,
  getAllUsers,
  getMostActiveUsers
}
