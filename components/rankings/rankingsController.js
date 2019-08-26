import errors from '../errors'
import service from './rankingsService'
import utils from './rankingsUtils'
import dal from './rankingsDAL'
import users from '../users'
import messages from '../messages'

const file = 'Ranking | Controller'

const calculatePositionByUser = async (userId, isCoreTeam) => {
  return service.calculatePositionByUser(userId, isCoreTeam)
}

const commandGeneral = async message => {
  const coreTeam = await users.isCoreTeam(message.u._id)
  return service.getGeneralRanking(message.u._id, coreTeam)
}

const commandByMonth = async message => {
  const month = await utils.getMonthFromMessage(message)
  return service.getRankingMessageByMonth(message.u._id, month)
}

const getRankingByMonth = async (month, team = false) => {
  if (!(await utils.isValidMonth(month))) month = utils.getCurrentMonth()

  const ranking = await service.getRankingByMonth(month)
  const monthName = utils.getMonthName(month - 1)

  const data = {
    first_users: [],
    last_users: [],
    monthName: monthName,
    error: null
  }

  if (ranking.error) {
    data.error = ranking.error
    return
  }

  if (!ranking.users.length) {
    data.error = `Ops! Ainda ninguém pontuou em ${monthName}. =/`
    return
  }

  if (ranking.users.length < 3) {
    data.error = `Ops! Ranking incompleto em ${monthName}. =/`
    return
  }

  const rankingUsers = await service.generateUsersPosition(ranking.users, team)

  data.first_users = rankingUsers.slice(0, 3)
  data.last_users = rankingUsers.slice(3, 20)

  return data
}

const getGeneralRanking = async (team = false, limit = 20) => {
  const allUsers = await users.find({ isCoreTeam: false }, { score: -1 }, limit)
  const rankingUsers = await service.generateUsersPosition(
    allUsers,
    team,
    limit
  )

  return {
    first_users: rankingUsers.slice(0, 3),
    last_users: rankingUsers.slice(3, limit),
    monthName: 'GERAL'
  }
}

const generate = async month => {
  try {
    if (!(await utils.isValidMonth(month))) month = utils.getCurrentMonth()

    const today = new Date(Date.now())
    const rankingUsers = await service.getRankingUsersByMonth(
      month,
      today.getFullYear()
    )

    const ranking = await service.findOrCreate(today.getFullYear(), month)
    if (ranking.isNew) await service.closePreviousRanking(today)
    ranking.users = rankingUsers
    return await dal.save(ranking)
  } catch (e) {
    errors._throw(file, 'generate', e)
  }
}

const sendToChannel = async () => {
  const today = new Date(Date.now())
  const roomname = process.env.ROCKET_DEFAULT_CHANNEL
  const isEnabled = process.env.ROCKET_SEND_TO_CHANNEL

  if (!roomname || isEnabled) return

  const ranking = await service.getRankingByMonth(today.getMonth())

  if (ranking.error || !ranking.users.length || ranking.users.length < 5) return

  const rankingUsers = await service.generateUsersPosition(
    ranking.users,
    false,
    5
  )

  let response = {
    msg: `Saiba quem são as pessoas que mais me orgulham no Olímpio pela interação.
Essas nobres pessoas têm se destacado em meu templo:`,
    attachments: []
  }

  response.attachments = await rankingUsers.map((user, index) => {
    return {
      text: `${index + 1}º lugar está ${user.name} com ${user.xp} xp e nível ${
        user.level
      }`
    }
  })

  return await messages.sendToRoom(response, roomname)
}

const getMonthlyPositionByUser = userId => {
  return service.getMonthlyPositionByUser(userId)
}

export default {
  calculatePositionByUser,
  commandGeneral,
  commandByMonth,
  getRankingByMonth,
  getGeneralRanking,
  generate,
  sendToChannel,
  getMonthlyPositionByUser
}
