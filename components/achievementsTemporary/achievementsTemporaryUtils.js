import moment from 'moment-timezone'
import achievementsUtils from '../achievements/achievementsUtils'

const today = moment(new Date()).utc()

const generateMessages = achievements => {
  return achievements.map(achievement => {
    const currentAchievement = getLastRatingEarned(achievement)

    return {
      text: `*${achievement.name}*:
      \n Você é ${currentAchievement.rating.name} ${currentAchievement.range.name} com total de ${currentAchievement.rating.total}.
      \n :trophy: Seu record é ${achievement.record.name} ${achievement.record.range} com total de ${achievement.record.total}.`
    }
  })
}

const getLastRatingEarned = achievement => {
  return achievementsUtils.getLastRatingEarned(achievement)
}

const convertDataToAchievement = (achievementTemporaryData, user) => {
  const ratings = generateNewRatings(achievementTemporaryData)

  return {
    name: achievementTemporaryData.name,
    kind: achievementTemporaryData.kind,
    rangeTime: achievementTemporaryData.rangeTime,
    startDate: Date.now(),
    temporaryData: achievementTemporaryData._id,
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

const setEarnedRating = temporaryAchievement => {
  let wasUpdated = false
  return temporaryAchievement.ratings.map(rating => {
    if (!wasUpdated) {
      let updatedRanges = setEarnedRange(rating)
      rating.ranges = updatedRanges.ranges

      if (updatedRanges.wasUpdated) {
        wasUpdated = true
        temporaryAchievement.lastEarnedDate = today.format()
        temporaryAchievement.total += 1
      }
    }

    return rating
  })
}

const setEarnedRange = rating => {
  let newTotal = rating.total + 1
  let wasUpdated = false

  let ranges = rating.ranges.map(range => {
    if (!range.earnedDate) {
      if (range.value == newTotal) {
        range.earnedDate = today.format()
        rating.total = newTotal
        wasUpdated = true
      }
    }
    return range
  })

  return {
    ranges: ranges,
    wasUpdated: wasUpdated
  }
}

const isInLimitTime = achievement => {
  if (achievement.lastEarnedDate) {
    const lastEarnedDate = moment(achievement.lastEarnedDate)
      .utc()
      .format()
    const limitTime = getLimitTime(
      achievement.lastEarnedDate,
      achievement.rangeTime
    )
    return !today.isSame(lastEarnedDate, 'day') && today.isBefore(limitTime)
  }

  return true
}

const getLimitTime = (date, rangeTime) => {
  let limitTime = date
  if (rangeTime == 'daily') {
    limitTime = moment(date)
      .add(1, 'days')
      .utc()
      .endOf('day')
      .toISOString()
  }

  return limitTime
}

const getRecord = achievement => achievementsUtils.getRecord(achievement)

export default {
  generateMessages,
  getLastRatingEarned,
  convertDataToAchievement,
  isInLimitTime,
  setEarnedRating,
  getRecord
}
