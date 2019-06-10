import moment from 'moment-timezone'

const today = moment(new Date())
  .utc()
  .endOf('day')
  .format()

const disable = achievement => {
  achievement.limitDate = today
  achievement.endDate = today
  return achievement.save()
}

export default {
  disable
}
