import dal from './achievementsLevelDAL'
import utils from './achievementsLevelUtils'

const getMessages = async userId => {
  const achievementsTemporary = await dal.findByUser(userId)
  return utils.generateMessages(achievementsTemporary)
}

const getRecord = achievement => {
  const lastRating = utils.getLastRatingEarned(achievement)
  let newRecord = utils.convertToRecord(lastRating, achievement)

  if (
    !achievement.record ||
    !achievement.record.name ||
    !achievement.record.level ||
    newRecord.level > achievement.record.level
  ) {
    return newRecord
  }

  return achievement.record
}

export default {
  getMessages,
  getRecord
}
