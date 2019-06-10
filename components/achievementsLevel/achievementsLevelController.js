import config from 'config-yml'
import dal from './achievementsLevelDAL'
import service from './achievementsLevelService'
import { setRangesEarnedDates, isNewLevel } from '../../utils/achievementsLevel'
import { getLevelRecord } from '../../utils/achievements'

const save = async (userId, currentLevel, newLevel) => {
  if (!userId) {
    console.log('Error user found on save achievement level')
    return
  }

  const achievementExistent = await dal.findByUser(userId)
  if (!achievementExistent) {
    try {
      return await defaultFunctions.createAchievement(userId, newLevel)
    } catch (error) {
      console.log('Error on create level achievement')
    }
  } else if (isNewLevel(currentLevel, newLevel)) {
    try {
      return await defaultFunctions.updateAchievement(
        achievementExistent,
        newLevel
      )
    } catch (error) {
      console.log('Error on update level achievement')
    }
  }
}

const createAchievement = async (userId, newLevel) => {
  const achievement = await defaultFunctions.generateNewAchievement(
    userId,
    newLevel
  )
  achievement.record = getLevelRecord(achievement)
  return await achievement.save()
}

const updateAchievement = async (achievementExistent, newLevel) => {
  let achievement = setRangesEarnedDates(achievementExistent, newLevel)
  achievement.record = getLevelRecord(achievement)
  return await achievement.save()
}

const generateNewAchievement = async (userId, newLevel) => {
  let achievement = new AchievementLevelModel()
  achievement.user = userId
  achievement.ratings = generateRatings()

  achievement = setRangesEarnedDates(achievement, newLevel)
  return achievement
}

const generateRatings = () => {
  const achievementsLevel = config['achievements-network'].level

  let ratings = []
  for (let item in achievementsLevel) {
    const achievement = achievementsLevel[item]
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

const getMessages = async userId => {
  return await service.getMessages(userId)
}

export default {
  save,
  createAchievement,
  updateAchievement,
  generateNewAchievement,
  getMessages
}
