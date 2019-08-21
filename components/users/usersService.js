import config from 'config-yml'
import moment from 'moment-timezone'
import dal from './usersDAL'
import utils from './usersUtils'
import rocket from '../rocket'
import next from '../next'
import users from '../users'
import usersLevelsHistory from '../usersLevelsHistory'
import achievementsLevel from '../achievementsLevel'
import achievements from '../achievements'
import messages from '../messages'
import errors from '../errors'
import interactions from '../interactions'
import rankings from '../rankings'

const file = 'Users | Controller'

const today = moment(new Date())
  .utc()
  .endOf('day')

const findInactivities = async () => {
  const today = new Date()

  const dateRange = today.setDate(
    today.getDate() - config.xprules.inactive.mindays
  )

  return await dal.find(
    {
      rocketId: { $exists: true },
      lastUpdate: { $lt: dateRange },
      score: { $gt: 1 }
    },
    {
      score: -1
    }
  )
}

const findUsersWithSlack = () => {
  return dal.find(
    {
      slackId: { $exists: true, $ne: null },
      score: { $gt: 5 }
    },
    { score: -1 },
    15
  )
}

const findRocketUsersByName = name => {
  return dal.find(
    {
      $text: {
        $search: name,
        $caseSensitive: false,
        $diacriticSensitive: false
      },
      rocketId: { $exists: true, $ne: null }
    },
    { score: -1 }
  )
}

const receiveProPlan = data => {
  return data.current_plan && data.current_plan.name
}

const getProBeginDate = (user, plan) => {
  return user.proBeginAt || plan.begin_at
}

const getProFinishDate = (user, plan) => {
  let finishDate = user.proFinishAt
  if (
    !user.proFinishAt ||
    moment(plan.finish_at).isSameOrAfter(user.proFinishAt)
  ) {
    finishDate = plan.finish_at
  }

  return finishDate
}

const updatePro = async user => {
  const canBePro = user.level > 2 || (await hasProRole(user))
  const wasPro = user.pro

  if (canBePro) {
    user = await setProPlan(user)
  } else {
    user = await removeProPlan(user)
  }

  if (canBePro !== wasPro) next.sendToQueue(user)

  return user
}

const setProPlan = user => {
  user.pro = true

  if (!user.proBeginAt && !user.proFinishAt) {
    user.proBeginAt = today.format()
    user.proFinishAt = today.add(5, 'years').format()
  } else if (
    user.proFinishAt &&
    moment(user.proFinishAt).isSameOrBefore(today)
  ) {
    user.proFinishAt = today.add(5, 'years').format()
  }

  return dal.save(user)
}

const removeProPlan = user => {
  user.pro = false

  if (user.proBeginAt && user.proFinishAt) {
    user.proFinishAt = today.format()
  }

  return dal.save(user)
}

const hasProRole = async user => {
  if (!user.rocketId) return

  const rocketUser = await rocket.getUserInfo(user.rocketId)
  const proRoles = ['moderator', 'owner', 'ambassador']
  const roles =
    rocketUser &&
    rocketUser.roles &&
    rocketUser.roles.filter(r => proRoles.includes(r))

  return roles.length > 0
}

const updateScore = async (user, score) => {
  if (!user || score === 0) return

  user.previousLevel = user.score === 0 ? 0 : user.level
  user.score += parseInt(score, 10)
  user.level = utils.calculateLevel(user.score)
  await user.save()
  await onChangeLevel(user)
  return user
}

const onChangeLevel = async user => {
  if (user.level !== user.previousLevel) {
    saveOnNewLevel(user)
  }
}

const saveOnNewLevel = async user => {
  await usersLevelsHistory.save(user._id, user.previousLevel, user.level)
  await achievementsLevel.handle(user._id, user.previousLevel, user.level)
}

const transferScoreToSlackUser = async (userId, score) => {
  return dal.findOneAndUpdate({ _id: userId }, { score }, { new: true })
}

const transferScoreToRocketUser = async (userId, score) => {
  let user = await dal.findOne({ _id: userId })
  const oldLevel = user.level
  user = await updateScore(user, score)

  await interactions.saveManual({
    score,
    value: 0,
    type: 'manual',
    user: user._id,
    username: user.username,
    text: `Transferido ${score} pontos da conta do slack`
  })
  await sendTransferScoreMessage(user, score, oldLevel)

  return user
}

const sendTransferScoreMessage = (user, score, oldLevel) => {
  const message = {
    msg: `Olá ${user.name}, sua pontuação do slack, *${score} pontos*, foi tranferida. Agora sua nova pontuação é de *${user.score} pontos!*`,
    attachments: []
  }

  if (oldLevel !== user.level) {
    message.attachments.push({
      text: `Ah, e você ainda subiu de nivel. Seu novo nivel é *${user.level}* .`
    })
  }

  return messages.sendToUser(message, user.username)
}

const isCoreTeam = async rocketId => {
  const user = await dal.findOne({ rocketId: rocketId })
  return user.isCoreTeam || false
}

const sendPoints = async data => {
  const { msg, u } = data

  try {
    const belongsCoreTeam = await isCoreTeam(u._id)
    if (!belongsCoreTeam) {
      return {
        msg: 'Ops! *Não tens acesso* a esta operação!'
      }
    }

    const sendedUser = await utils.getSendedPointsUser(msg)
    const points = await utils.getSendedPointsValue(msg)
    const reason = await utils.getSendedPointsReason(msg)

    if (!sendedUser || !points || !reason) {
      return {
        msg: `Ops! Tem algo *errado* no seu comando. Tente desta forma:
        ${'`!darpontos`'} ${'`@nome-usuario`'} ${'`pontos`'} ${'`"motivo"`'}
        Ah! E o motivo deve estar entre aspas!`
      }
    }

    if (sendedUser === u.username) {
      return {
        msg: `Ops! *Não podes* dar pontos para ti mesmo.`
      }
    }

    const user = await users.findOne({ username: sendedUser })
    if (!user) {
      return {
        msg: `Ops! Usuário *${sendedUser}* não encontrado.`
      }
    }

    const updatedScore = await users.updateScore(user, points)
    let response = {
      msg: 'Opa, aconteceu algo inesperado. Tua pontuação não foi enviada!'
    }

    if (updatedScore) {
      const message = {
        msg: `Acabaste de receber *${points} pontos* de experiência por *${reason}*.`
      }

      messages.sendToUser(message, user.username)

      response = {
        msg: `Sucesso! Enviaste *${points} pontos* de experiência para *${user.name}*!`
      }

      await interactions.saveManual({
        score: points,
        value: 0,
        type: 'manual',
        user: user._id,
        username: user.username,
        text: `você recebeu esses ${points} pontos de ${u.username}`
      })
    }

    return response
  } catch (e) {
    errors._throw(file, 'sendPoints', e)
  }
}

const getUserProfileByUuid = async uuid => {
  if (!uuid) return { error: 'UUID não enviado' }

  const user = await users.findOne({ uuid: uuid })

  if (!user) return { error: 'Usuário não encontrado' }

  const generalPosition = await rankings.calculatePositionByUser(
    user.rocketId,
    user.isCoreTeam
  )

  const monthlyPosition = await rankings.getMonthlyPositionByUser(user._id)
  const allAchievements = await achievements.findAllByUser(user._id)

  console.log('allAchievements', allAchievements)

  return {
    name: user.name,
    avatar: user.avatar || '',
    level: user.level,
    score: user.score,
    generalPosition,
    monthlyPosition,
    userAchievements: [
      {
        name: 'Network',
        achievements: allAchievements
      }
    ]
  }
}

export default {
  findInactivities,
  receiveProPlan,
  getProBeginDate,
  getProFinishDate,
  updatePro,
  updateScore,
  findUsersWithSlack,
  findRocketUsersByName,
  transferScoreToSlackUser,
  transferScoreToRocketUser,
  isCoreTeam,
  sendPoints,
  saveOnNewLevel,
  getUserProfileByUuid
}
