import moment from 'moment-timezone'
import achievementsUtils from '../achievements/achievementsUtils'

const today = moment(new Date())
  .utc()
  .format()

const generateMessages = achievement => {
  const lastRating = getLastRatingEarned(achievement)
  const recordRange = achievement.record.range
    ? ` ${achievement.record.range}`
    : ''

  return [
    {
      text: `*Network | Nível*:
    \n Você é ${lastRating.rating.name} ${lastRating.range.name} com nível ${lastRating.range.value}.
    \n :trophy: Seu record é ${achievement.record.name}${recordRange} com nível ${achievement.record.level}.`
    }
  ]
}

const convertToRecord = (lastRating, achievement) => {
  if (lastRating.rating && lastRating.range) {
    return {
      name: lastRating.rating.name,
      range: lastRating.range.name,
      level: lastRating.range.value,
      earnedDate: today
    }
  }

  return achievement.record
}

const getLastRatingEarned = achievement => {
  return achievementsUtils.getLastRatingEarned(achievement)
}

export default {
  generateMessages,
  convertToRecord,
  getLastRatingEarned
}
