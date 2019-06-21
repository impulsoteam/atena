import config from 'config-yml'
import dal from './usersDAL'

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

export default {
  findInactivities,
  receiveProPlan
}
