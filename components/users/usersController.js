import moment from 'moment-timezone'
import utils from './usersUtils'
import dal from './usersDAL'
import rankings from '../rankings'

const findBy = query => {
  return dal.findBy(query)
}

const findOne = query => {
  return dal.findOne(query)
}

const updateScore = async (user, score) => {
  if (!user) return

  user.score += score
  user.previousLevel = user.level
  user.level = utils.calculateLevel(user.score)
  await onChangeLevel(user)
  return user.save()
}

const onChangeLevel = async user => {
  if (user.level !== user.previousLevel) {
    // await saveLevelHistoryChanges(this._id, this._previousLevel, this.level)
    // const achievement = await achievementLevelController.save(
    //   this._id,
    //   this._previousLevel,
    //   this.level
    // )

    // const score = getLevelScore(achievement)
    // if (score > 0) {
    //   this.score += score
    //   await saveScoreInteraction(this, achievement, score, 'Conquista de Nível')
    // }

    // await sendLevelMessage(this, achievement)
    // TODO: save historico
    // TODO: save achievement
    // TODO: valida pro
    console.log('Entrou em onChangeLevel')
  }
}

const commandScore = async message => {
  let response = {
    msg: 'Ops! Você ainda não tem pontos registrados.'
  }

  const user = await dal.findOne({ username: message.u.username })
  const position = await rankings.calculatePositionByUser(
    user.rocketId,
    user.isCoreTeam
  )

  if (user && position > 0) {
    response = {
      msg: `Olá ${user.name}, atualmente você está no nível ${user.level} com ${user.score} XP`,
      attachments: [
        {
          text: `Ah, e você está na posição ${position} do ranking`
        }
      ]
    }
  }

  return response
}

const findAllToRanking = async (
  isCoreTeam = false,
  limit = 20,
  select = '-email -teams -_id -lastUpdate',
  team = null,
  sort = { score: -1 }
) => {
  let query = {
    score: { $gt: 0 },
    isCoreTeam: isCoreTeam
  }

  if (team) {
    query = {
      ...query,
      teams: team
    }
  }

  return dal.findAll(query, select, limit, sort)
}

const isCoreTeam = async rocketId => {
  const user = await dal.findOne({ rocketId: rocketId })
  return user.isCoreTeam || false
}

const commandPro = async message => {
  let response = {
    msg: 'Ops! Você não tem plano pro.'
  }

  const user = await dal.findOne({ rocketId: message.u._id })
  if (user.pro) {
    const beginDate = user.proBeginAt
      ? moment(user.proBeginAt).format('DD/MM/YYYY')
      : 'Sem data definida'

    const finishDate = user.proFinishAt
      ? moment(user.proFinishAt).format('DD/MM/YYYY')
      : 'Sem data definida'

    response = {
      msg: `Olá ${user.name}, você tem um plano pro.`,
      attachments: [
        {
          text: `Início do Plano: ${beginDate}`
        },
        {
          text: `Fim do Plano: ${finishDate}`
        }
      ]
    }
  }

  return response
}

export default {
  findBy,
  findOne,
  updateScore,
  commandScore,
  commandPro,
  findAllToRanking,
  isCoreTeam
}
