import service from './achievementsTemporaryService'
import dal from './achievementsTemporaryDAL'
import utils from './achievementsTemporaryUtils'
import achievementsTemporaryData from '../achievementsTemporaryData'

const handle = async (interaction, user) => {
  let achievementsData = await achievementsTemporaryData.getAllByInteraction(
    interaction
  )

  for (let data of achievementsData) {
    let achievement = await service.findOrCreate(data, user)
    if (achievement) {
      if (utils.isBeforeEndDate(data)) {
        await service.update(achievement, user, interaction)
      } else {
        console.log('!utils.isBeforeEndDate(data)')
        // let achievement = resetEarnedAchievements(achievement)
        // await achievement.save()
      }
    }
  }
}

const getMessages = async userId => {
  return await service.getMessages(userId)
}

const resetAllEarned = temporaryAchievement => {
  return service.resetAllEarned(temporaryAchievement)
}

const findInactivities = async () => {
  return await dal.getAllInactivitiesDaily()
}

export default {
  handle,
  getMessages,
  resetAllEarned,
  findInactivities
}
