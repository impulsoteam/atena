import moment from 'moment-timezone'
import dal from './achievementsTemporaryDAL'
import utils from './achievementsTemporaryUtils'
import achievementsUtils from '../achievements/achievementsUtils'

const getMessages = async userId => {
  const achievementsTemporary = await dal.findAllByUser(userId)
  return utils.generateMessages(achievementsTemporary)
}

const resetAllEarned = achievement => {
  achievement.ratings = achievement.ratings.map(rating => {
    rating.ranges = rating.ranges.map(range => {
      return {
        name: range.name,
        value: range.value
      }
    })

    rating.total = 0
    return rating
  })

  achievement.total = 0
  return achievement
}

const getOrCreate = async (temporaryData, user) => {
  let temporaryAchievement = await dal.findOne({
    temporaryData: temporaryData._id,
    user: user._id
  })

  if (!temporaryAchievement && isBeforeLimitDate(temporaryData)) {
    temporaryAchievement = await create(temporaryData, user)
  }

  return temporaryAchievement
}

const create = async (temporaryData, user) => {
  let achievement = utils.convertDataToAchievement(temporaryData, user._id)
  await sendMessageStart(user, achievement)
  return dal.create(achievement)
}

const setEarned = async (achievement, user) => {
  if (!utils.isInLimitTime(achievement)) {
    return achievement
  }

  achievement.ratings = utils.setEarnedRating(achievement.ratings)
  achievement.record = utils.getRecord(achievement)
  // await addScore(user, achievement)
  return await achievement.save()
}

const isBeforeLimitDate = achievement => {
  const currentDate = moment(new Date())
  const limitDate = moment(achievement.limitDate)
  return limitDate.isSameOrAfter(currentDate)
}

export const isBeforeEndDate = achievement => {
  const currentDate = moment(new Date())
  const limitDate = moment(achievement.endDate)
  return limitDate.isSameOrAfter(currentDate)
}

const sendMessageStart = (user, achievement) => {
  const current = {
    name: achievement.name,
    rating: achievement.ratings[0].name,
    range: achievement.ratings[0].ranges[0].name
  }

  achievementsUtils.sendEarnedMessage(user, current)
}

export default {
  getMessages,
  resetAllEarned,
  getOrCreate,
  create,
  setEarned
}
