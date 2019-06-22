import users from '../users'
import utils from './rankingsUtils'

const calculatePositionByUser = async (userId, isCoreTeam = false) => {
  const allUsers = await users.findAllToRanking(isCoreTeam, 0)
  return (await getPositionFromUsers(allUsers, userId)) + 1 || 0
}

const getPositionFromUsers = async (allUsers, userId) => {
  return allUsers.map(e => e.rocketId).indexOf(userId)
}

const getGeneralRanking = async (userId, isCoreTeam) => {
  let response = {
    msg: 'Veja as primeiras pessoas do ranking:',
    attachments: []
  }

  const allUsers = await users.findAllToRanking(isCoreTeam, 5)
  const myPosition = await calculatePositionByUser(userId, isCoreTeam)
  if (!allUsers.length) response.msg = 'Ops! Ainda ninguém pontuou. =/'

  response.attachments = allUsers.map((user, index) => ({
    text: `${index + 1}º lugar está ${
      user.rocketId === userId ? 'você' : user.name
    } com ${parseInt(user.score)} XP, no nível ${user.level}`
  }))

  response.attachments.push({
    text: `Ah, e você está na posição ${myPosition} do ranking`
  })

  return response
}

const getRankingByMonth = async (userId, month) => {
  const rankingMonthly = await utils.getRankingByMonth(month)
  if (rankingMonthly.error) {
    return { msg: rankingMonthly.error }
  }

  const monthName = utils.getMonthName(month - 1)
  if (rankingMonthly.users.length === 0) {
    return { msg: `Ops! Ainda ninguém pontuou em ${monthName}. =/` }
  }

  let response = {
    msg: `Veja as primeiras pessoas do ranking em ${monthName}:`,
    attachments: []
  }

  let allUsers = await users.findAllToRanking(false, 0)

  response.attachments = await rankingMonthly.users
    .slice(0, 5)
    .map((user, index) => {
      const userAtena = allUsers.find(u => u.rocketId === user.user)
      if (!userAtena) return false

      return {
        text: `${index + 1}º lugar está ${userAtena.name} com ${
          user.score
        } XP, no nível ${user.level}`
      }
    })

  let userMsg = `Opa, você não pontuou no game em ${monthName}`
  const position = await getPositionFromUsers(rankingMonthly.users, userId)
  if (position > 0)
    userMsg = `Ah, e você está na posição ${position} do ranking de ${monthName}`

  response.attachments.push({ text: userMsg })

  return response
}

export default {
  calculatePositionByUser,
  getGeneralRanking,
  getRankingByMonth
}
