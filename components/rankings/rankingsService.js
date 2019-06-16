import users from '../users'

const calculatePositionByUser = async (userId, isCoreTeam = false) => {
  const allUsers = await users.findAllToRanking(isCoreTeam, 0)
  return (await allUsers.map(e => e.rocketId).indexOf(userId)) + 1 || 0
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

  // TODO: se analytics
  // analyticsSendBotCollect(req.body)

  return response
}

export default {
  calculatePositionByUser,
  getGeneralRanking
}
