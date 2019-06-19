import config from 'config-yml'
import dal from './usersDAL'

const findInactivities = async () => {
  const today = new Date()

  const dateRange = today.setDate(
    today.getDate() - config.xprules.inactive.mindays
  )

  return await dal
    .findBy({
      rocketId: { $exists: true },
      lastUpdate: { $lt: dateRange },
      score: { $gt: 1 }
    })
    .sort({
      score: -1
    })
    .exec()
}

export default {
  findInactivities
}
