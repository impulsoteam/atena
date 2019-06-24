import config from 'config-yml'
import moment from 'moment-timezone'
import dal from './usersDAL'
import utils from './usersUtils'
import rocket from '../rocket'
import next from '../next'
import usersLevelsHistory from '../usersLevelsHistory'
import achievementsLevel from '../achievementsLevel'
import messages from '../messages'

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
      slackId: { $exists: true },
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
      rocketId: { $exists: true }
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
  }
}

const transferScoreToSlackUser = async (userId, score) => {
  return dal.findOneAndUpdate({ _id: userId }, { score }, { new: true })
}

const transferScoreToRocketUser = async (userId, score) => {
  let user = await dal.findOne({ _id: userId })
  const oldLevel = user.level
  user = await updateScore(user, score)
  await sendTransferScoreMessage(user, score, oldLevel)
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
  transferScoreToRocketUser
}
