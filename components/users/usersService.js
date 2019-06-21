import config from 'config-yml'
import moment from 'moment-timezone'
import dal from './usersDAL'
import rocket from '../rocket'
import next from '../next'

const today = moment(new Date())
  .utc()
  .endOf('day')

const findInactivities = async () => {
  const today = new Date()

  const dateRange = today.setDate(
    today.getDate() - config.xprules.inactive.mindays
  )

  return await dal.findBy(
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

export default {
  findInactivities,
  receiveProPlan,
  getProBeginDate,
  getProFinishDate,
  updatePro
}
