import errors from '../errors'
import service from './rankingsService'
import utils from './rankingsUtils'
import users from '../users'
import dal from './rankingsDAL'

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

// index
const getRankingByMonth = async (month, team = false) => {
  // TODO: move to miner
  // const isMiner = await minerController.isMiner(req, res)
  // const { team, token } = req.headers
  // if (isMiner && isValidToken(team, token)) {
  // res.json(initialData)
  // }

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

  let rankingUsers = await service.generateUsersPosition(ranking.users, team)

  data.first_users = rankingUsers.slice(0, 3)
  data.last_users = rankingUsers.slice(3, 20)

  return data
}

// general
// const general = async (req, res) => {
//   const isMiner = await minerController.isMiner(req, res)
//   const { team, token } = req.headers
//   let first_users = []
//   let last_users = []
//   const limit = isMiner ? 0 : 20

//   let users = await userController.findAll(
//     false,
//     limit,
//     '-email -_id -lastUpdate'
//   )
//   users = await position(users)
//   if (isMiner) users = await byTeam(users, team)
//   first_users = await firstUsers(users)
//   last_users = await lastUsers(users)
//   const initialData = {
//     title: 'Ranking Geral',
//     first_users: first_users,
//     last_users: last_users,
//     monthName: 'GERAL',
//     page: 'geral'
//   }

//   if (req.query.format === 'json' || (isMiner && isValidToken(team, token))) {
//     res.json(initialData)
//   } else {
//     renderScreen(req, res, 'Ranking', initialData)
//   }
// }

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

export default {
  calculatePositionByUser,
  commandGeneral,
  commandByMonth,
  getRankingByMonth,
  generate
}
