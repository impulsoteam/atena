import service from './achievementsLevelService'
import utils from './achievementsLevelUtils'

const handle = async (userId, currentLevel, newLevel) => {
  if (!utils.isNewLevel(currentLevel, newLevel)) return

  let achievement = await service.findOrCreate(userId)
  achievement = await service.update(achievement, newLevel)
  await service.addScore(achievement, userId)
}

const getMessages = async userId => {
  return await service.getMessages(userId)
}

export default {
  handle,
  getMessages
}
