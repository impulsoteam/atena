import service from './achievementsTemporaryService'
import dal from './achievementsTemporaryDAL'
import achievementsTemporaryDataController from '../achievementsTemporaryData'

const save = async (interaction, user) => {
  try {
    let data = await achievementsTemporaryDataController.getByInteraction(
      interaction
    )

    for (let temporaryAchievementData of data) {
      let temporaryAchievement = await service.getOrCreate(
        temporaryAchievementData,
        user
      )

      if (temporaryAchievement) {
        if (service.isBeforeEndDate(temporaryAchievementData)) {
          await updateAchievementTemporary(temporaryAchievement, user)
        } else {
          let temporaryAchievement = resetEarnedAchievements(
            temporaryAchievement
          )
          await temporaryAchievement.save()
        }
      }
    }
  } catch (error) {
    console.log('[CONTROLLER] Error saving temporary achievement')
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
  save,
  getMessages,
  resetAllEarned,
  findInactivities
}
