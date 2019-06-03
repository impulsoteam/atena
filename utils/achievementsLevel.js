import moment from 'moment'

const today = moment(new Date())
  .utc()
  .format()

export const isNewLevel = (currentLevel, newLevel) => {
  return parseInt(currentLevel, 10) !== parseInt(newLevel, 10)
}

export const setRangesEarnedDates = (achievement, level) => {
  achievement.ratings = achievement.ratings.map(rating => {
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

  return achievement
}
