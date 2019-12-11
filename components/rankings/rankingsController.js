import moment from 'moment'

import service from './rankingsService'
import utils from './rankingsUtils'
import interactions from '../interactions'
import users from '../users'
import messages from '../messages'

const sendToChannel = async () => {
  const roomname = process.env.ROCKET_DEFAULT_CHANNEL
  const isEnabled = process.env.ROCKET_SEND_TO_CHANNEL

  if (!roomname || !JSON.parse(isEnabled)) return

  const ranking = await interactions.findByDate({ limit: 5 })

  if (ranking.error || ranking.length < 5) return
  let response = {
    msg: `Saiba quem são as pessoas que mais me orgulham no Olimpo pela interação.
Essas nobres pessoas têm se destacado em meu templo:`,
    attachments: []
  }

  response.attachments = ranking.map((user, index) => {
    return {
      text: `${index + 1}º lugar está *${user.name}* com *${
        user.score
      }* pontos de reputação e nível *${user.level}*`
    }
  })

  return messages.sendToRoom(response, roomname)
}

const getGeneralRanking = async ({ page, limit }) => {
  try {
    const ranking = await users.aggregate([
      {
        $match: {
          isCoreTeam: false,
          rocketId: { $ne: null },
          score: { $gt: 0 }
        }
      },
      {
        $project: {
          rocketId: 1,
          name: 1,
          avatar: 1,
          score: 1,
          level: 1,
          uuid: 1,
          username: 1
        }
      },
      { $sort: { score: -1 } },
      { $skip: page ? parseInt(page) * parseInt(limit || 50) : 0 },
      { $limit: parseInt(limit) || 99999 }
    ])

    return ranking
  } catch (error) {
    return { message: `Não foi possível buscar o ranking`, error }
  }
}

const getMonthlyRanking = async ({ year, month, limit, page }) => {
  const { date, monthName } = await utils.getDate({ year, month })
  try {
    const ranking = await interactions.findByDate({ date, limit, page })

    if (!ranking.length) {
      return {
        message: `Ops! Ainda ninguém pontuou em ${monthName}. =/`
      }
    }

    if (ranking.length < 3) {
      return {
        message: `Ops! Ranking incompleto em ${monthName}. =/`
      }
    }

    return ranking
  } catch (error) {
    return { message: `Não foi possível buscar o ranking`, error }
  }
}

const commandGeneral = async message => {
  const ranking = await getGeneralRanking({})
  const user = await users.findOne({ rocketId: message.u._id })
  return await service.generateRankingMessage({ ranking, user })
}

const commandByDate = async message => {
  const { date, monthName } = await utils.getDateFromMessage(message)
  const user = await users.findOne({ rocketId: message.u._id })
  const ranking = await interactions.findByDate({ date })
  return service.generateRankingMessage({ ranking, user, monthName })
}

const getMonthlyPositionByUser = async userId => {
  const ranking = await interactions.findByDate({})
  const index = ranking.findIndex(user => user._id.toString() == userId)
  return {
    position: index === -1 ? null : index + 1,
    score: ranking[index].score || null
  }
}
const getMonthlyScoreByUser = async userId => {
  const score = await interactions.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: moment()
            .startOf('month')
            .toDate(),
          $lt: moment()
            .endOf('month')
            .toDate()
        }
      }
    },
    {
      $group: {
        _id: null,
        score: { $sum: '$score' }
      }
    }
  ])

  return score[0].score
}

const getGeneralPositionByUser = async userId => {
  const ranking = await users.aggregate([
    {
      $match: {
        rocketId: { $ne: null },
        score: { $gt: 0 },
        isCoreTeam: false
      }
    },
    { $project: { rocketId: 1, name: 1, score: 1, level: 1 } },
    { $sort: { score: -1 } }
  ])
  const index = ranking.findIndex(user => user._id.toString() == userId)
  return {
    position: index === -1 ? null : index + 1,
    score: ranking[index].score
  }
}

const calculatePositionByUser = async userId => {
  const monthly = await getMonthlyPositionByUser(userId)
  const general = await getGeneralPositionByUser(userId)

  return {
    monthly,
    general
  }
}
export default {
  calculatePositionByUser,
  getMonthlyScoreByUser,
  commandGeneral,
  commandByDate,
  getGeneralRanking,
  getMonthlyRanking,
  sendToChannel
}
