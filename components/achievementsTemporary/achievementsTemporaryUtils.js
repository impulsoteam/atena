import moment from 'moment-timezone'
import config from 'config-yml'
import achievementsUtils from '../achievements/achievementsUtils'

const today = moment(new Date()).utc()

const generateMessages = achievements => {
  return achievements.map(achievement => {
    const currentAchievement = getLastRatingEarned(achievement.ratings)

    return {
      text: `*${achievement.name}*:
      \n Você é ${currentAchievement.rating.name} ${currentAchievement.range.name} com total de ${currentAchievement.rating.total}.
      \n :trophy: Seu record é ${achievement.record.name} ${achievement.record.range} com total de ${achievement.record.total}.`
    }
  })
}

const convertDataToAchievement = (achievementData, user) => {
  const ratings = generateNewRatings(achievementData)

  return {
    name: achievementData.name,
    kind: achievementData.kind,
    rangeTime: achievementData.rangeTime,
    startDate: Date.now(),
    temporaryData: achievementData._id,
    user: user,
    ratings: ratings
  }
}

const generateNewRatings = achievements => {
  return achievements.ratings.map(rating => {
    return {
      name: rating.name,
      xp: rating.xp,
      total: 0,
      ranges: rating.ranges
    }
  })
}

const getLastRatingEarned = ratings => {
  return achievementsUtils.getLastRatingEarned(ratings)
}

const getRecord = achievement => {
  const newRecord = getLastRatingEarned(achievement.ratings)

  if (
    !achievement.record ||
    !achievement.record.name ||
    newRecordIsBigger(newRecord, achievement.record)
  ) {
    return newRecord
  }

  return achievement.record
}

const newRecordIsBigger = (newRecord, current) => {
  if (!current || !current.name) return true

  const positionRatings = getPositionRatings()
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newRecord.name.toLowerCase()
  )

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  )

  if (newPosition == currentPosition) {
    return newRecord.total >= current.total
  } else {
    return newPosition > currentPosition
  }
}

const getPositionRatings = () =>
  Object.keys(config.ratings).map(key => config.ratings[key])

const isBeforeLimitDate = achievement => {
  const currentDate = moment(new Date())
  const limitDate = moment(achievement.limitDate)
  return limitDate.isSameOrAfter(currentDate)
}

const isBeforeEndDate = achievement => {
  const currentDate = moment(new Date())
  const limitDate = moment(achievement.endDate)
  return limitDate.isSameOrAfter(currentDate)
}

const isInDeadline = achievement => {
  if (achievement.lastEarnedDate) {
    const lastEarnedDate = moment(achievement.lastEarnedDate)
      .utc()
      .format()
    const deadline = generateDeadlineDate(
      achievement.lastEarnedDate,
      achievement.rangeTime
    )
    const today = moment(new Date()).utc()
    return !today.isSame(lastEarnedDate, 'day') && today.isBefore(deadline)
  }

  return true
}

const generateDeadlineDate = (date, rangeTime) => {
  let deadline = date
  if (rangeTime == 'daily') {
    deadline = moment(date)
      .add(1, 'days')
      .utc()
      .endOf('day')
      .toISOString()
  }

  return deadline
}

const setEarned = ratings => {
  let wasEarned = false
  return ratings.map(rating => {
    const current = !rating.ranges.every(range => range.earnedDate)
    if (current && !wasEarned) {
      rating.ranges = setEarnedRanges(rating)
      rating.total = getEarnedTotal(rating)
      wasEarned = true
    }
    return rating
  })
}

const getEarnedTotal = rating => {
  let total = rating.total
  const wasEarned = rating.ranges.find(range =>
    wasEarnedToday(range.earnedDate)
  )
  if (wasEarned) total += 1
  return total
}

const wasEarnedToday = earnedDate => {
  return moment(earnedDate).isSame(moment(new Date()), 'day')
}

const setEarnedRanges = rating => {
  let total = rating.total + 1
  return rating.ranges.map(range => {
    if (!range.earnedDate && range.value == total) {
      range.earnedDate = today
    }
    return range
  })
}

const calculateScoreToIncrease = ratings => {
  let score = 0
  const today = moment(new Date())
  const rating = ratings
    .reverse()
    .find(rating => rating.ranges.every(range => range.earnedDate))

  if (rating) {
    const wasEarned = rating.ranges.find(range =>
      moment(range.earnedDate).isSame(today, 'day')
    )

    if (wasEarned) score = rating.xp
  }

  return score
}

export default {
  generateMessages,
  getLastRatingEarned,
  convertDataToAchievement,
  getRecord,
  isBeforeLimitDate,
  isBeforeEndDate,
  isInDeadline,
  setEarned,
  calculateScoreToIncrease
}
