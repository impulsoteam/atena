import service from './achievementsTemporaryService'
import dal from './achievementsTemporaryDAL'
import {
  isBeforeLimitDate,
  isBeforeEndDate,
  resetEarnedAchievements,
  createAchievementTemporary,
  updateAchievementTemporary
} from '../utils/achievementsTemporary'
import userController from '../controllers/user'
import achievementsTemporaryDataController from '../achievementsTemporaryData'

const save = async (interaction, user) => {
  try {
    let data = await achievementsTemporaryDataController.getByInteraction(
      interaction
    )

    for (let temporaryAchievementData of data) {
      let temporaryAchievementExistent = await dal.findOne({
        temporaryData: temporaryAchievementData._id,
        user: user._id
      })

      if (
        !temporaryAchievementExistent &&
        isBeforeLimitDate(temporaryAchievementData)
      ) {
        temporaryAchievementExistent = await createAchievementTemporary(
          temporaryAchievementData,
          user
        )
      }

      if (temporaryAchievementExistent) {
        if (isBeforeEndDate(temporaryAchievementData)) {
          await updateAchievementTemporary(temporaryAchievementExistent, user)
        } else {
          let temporaryAchievement = resetEarnedAchievements(
            temporaryAchievementExistent
          )
          await temporaryAchievement.save()
        }
      }
    }
  } catch (error) {
    console.log('Error saving temporary achievement')
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
