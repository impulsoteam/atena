import moment from 'moment-timezone'
import utils from './achievementsTemporaryDataUtils'
import dal from './achievementsTemporaryDataDAL'

const today = moment(new Date())
  .utc()
  .endOf('day')
  .format()

const disable = achievement => {
  achievement.limitDate = today
  achievement.endDate = today
  return achievement.save()
}

const getAllByInteraction = interaction => {
  const query = utils.getQueryToFindCurrent(interaction)
  return dal.findAllByQuery(query)
}

export default {
  disable,
  getAllByInteraction
}
