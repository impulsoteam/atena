import moment from 'moment-timezone'
import utils from './usersUtils'
import dal from './usersDAL'
import service from './usersService'
import rankings from '../rankings'
import messages from '../messages'
import usersLevelsHistory from '../usersLevelsHistory'
import achievementsLevel from '../achievementsLevel'

const save = user => {
  return dal.save(user)
}

const findBy = query => {
  return dal.findBy(query)
}

const findOne = query => {
  return dal.findOne(query)
}

const findOneAndUpdate = (query, args, options) => {
  return dal.findOneAndUpdate(query, args, options)
}

const updateScore = async (user, score) => {
  if (!user || score === 0) return

  user.previousLevel = user.score === 0 ? 0 : user.level
  user.score += score
  user.level = utils.calculateLevel(user.score)
  await user.save()
  await onChangeLevel(user)
  return user
}

const onChangeLevel = async user => {
  if (user.level !== user.previousLevel) {
    await usersLevelsHistory.save(user._id, user.previousLevel, user.level)
    await achievementsLevel.handle(user._id, user.previousLevel, user.level)

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

const commandUserIsPro = async message => {
  const coreTeam = await isCoreTeam(message.u._id)
  if (!coreTeam) return { msg: 'Ops! *Não tens acesso* a esta operação!' }

  const username = utils.getUsernameByMessage(message.msg)
  if (!username) return { msg: 'Ops! Você não nos mandou o *usuário*.' }

  const user = await dal.findOne({ username: username })
  if (!user) return { msg: 'Usuário *não* encontrado.' }

  if (!user.pro) return { msg: 'Usuário *não possui* plano pro!' }

  const beginDate = user.proBeginAt
    ? moment(user.proBeginAt).format('L')
    : 'Sem data definida'

  const finishDate = user.proFinishAt
    ? moment(user.proFinishAt).format('L')
    : 'Sem data definida'

  return {
    msg: 'Usuário *possui* plano pro!',
    attachments: [
      {
        text: `Plano iniciou em ${beginDate} e terminará em ${finishDate}`
      }
    ]
  }
}

const sendWelcomeMessage = user => {
  const message = utils.getWelcomeMessage()
  return messages.sendToUser(message, user)
}

const findInactivities = async () => {
  return service.findInactivities()
}

const receiveProPlan = data => {
  return service.receiveProPlan(data)
}

const getProBeginDate = (user, plan) => {
  return service.getProBeginDate(user, plan)
}

const getProFinishDate = (user, plan) => {
  return service.getProFinishDate(user, plan)
}

const updatePro = async user => {
  return service.updatePro(user)
}

export default {
  save,
  findBy,
  findOne,
  findOneAndUpdate,
  findInactivities,
  updateScore,
  commandScore,
  commandPro,
  findAllToRanking,
  isCoreTeam,
  commandUserIsPro,
  sendWelcomeMessage,
  receiveProPlan,
  getProBeginDate,
  getProFinishDate,
  updatePro
}
