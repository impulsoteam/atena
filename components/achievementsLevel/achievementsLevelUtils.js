import moment from 'moment-timezone'
import achievementsUtils from '../achievements/achievementsUtils'
import dal from './achievementsLevelDAL'

const today = moment(new Date())
  .utc()
  .format()

const generateNewAchievement = userId => {
  return {
    user: userId,
    ratings: generateRatings(),
    record: {}
  }
}

const generateRatings = () => {
  const achievements = dal.findMain()

  let ratings = []
  for (let item in achievements) {
    const achievement = achievements[item]
    ratings.push({
      name: achievement.name,
      xp: achievement.xp,
      ranges: generateRanges(achievement.ranges)
    })
  }

  return ratings
}

const generateRanges = ranges => {
  let newRanges = []
  for (let item in ranges) {
    newRanges.push({
      name: item,
      value: ranges[item]
    })
  }

  return newRanges
}

const setRangesEarnedDates = (ratings, level) => {
  return ratings.map(rating => {
    rating.ranges = rating.ranges.map(range => {
      if (range.value <= level) {
        if (!range.earnedDate) range.earnedDate = today
      } else {
        range.earnedDate = null
      }

      return range
    })

    return rating
  })
}

const generateMessages = achievement => {
  if (!achievement) return {}

  const lastRating = getLastRatingEarned(achievement)
  const recordRange = achievement.record.range
    ? ` ${achievement.record.range}`
    : ''

  return [
    {
      text: `*Network | Nível*:
    \n Você é ${lastRating.name} ${lastRating.range} com nível ${lastRating.total}.
    \n :trophy: Seu record é ${achievement.record.name}${recordRange} com nível ${achievement.record.level}.`
    }
  ]
}

const convertToRecord = rating => {
  return {
    name: rating.name,
    range: rating.range,
    level: rating.total,
    earnedDate: rating.earnedDate
  }
}

const getLastRatingEarned = achievement => {
  return achievementsUtils.getLastRatingEarned(achievement)
}

const getScore = achievement => {
  let score = 0
  if (isNewAchievement(achievement)) {
    score = getAllScoreToIncrease(achievement.ratings)
  } else {
    score = getLastScoreToIncrease(achievement.ratings)
  }

  return score
}

const getAllScoreToIncrease = ratings => {
  return ratings.reduce((total, rating) => {
    const earned = rating.ranges.every(range => range.earnedDate)
    return total + (earned ? rating.xp : 0)
  }, 0)
}

const getLastScoreToIncrease = ratings => {
  const rating = ratings
    .reverse()
    .find(rating => rating.ranges.every(range => range.earnedDate))
  return (rating && rating.xp) || 0
}

const isNewAchievement = achievement => {
  return moment(achievement.createdAt).isSame(moment(new Date()), 'day')
}

const isNewLevel = (currentLevel, newLevel) => {
  return parseInt(currentLevel, 10) !== parseInt(newLevel, 10)
}

const getRecord = achievement => {
  const rating = getLastRatingEarned(achievement)
  let newRecord = convertToRecord(rating)

  if (
    !achievement.record ||
    !achievement.record.name ||
    newRecord.level > achievement.record.level
  ) {
    return newRecord
  }

  return achievement.record
}

export default {
  generateMessages,
  convertToRecord,
  getLastRatingEarned,
  generateNewAchievement,
  getRecord,
  setRangesEarnedDates,
  getScore,
  isNewLevel
}
