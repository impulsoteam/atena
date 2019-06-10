import dal from './achievementsTemporaryDAL'
import utils from './achievementsTemporaryUtils'

const getMessages = async userId => {
  const achievementsTemporary = await dal.findAllByUser(userId)
  return utils.generateMessages(achievementsTemporary)
}

const resetAllEarned = temporaryAchievement => {
  temporaryAchievement.ratings = temporaryAchievement.ratings.map(rating => {
    rating.ranges = rating.ranges.map(range => {
      return {
        name: range.name,
        value: range.value
      }
    })

    rating.total = 0
    return rating
  })

  temporaryAchievement.total = 0
  return temporaryAchievement
}

export default {
  getMessages,
  resetAllEarned
}
