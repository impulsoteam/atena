import service from './achievementsTemporaryService'
import dal from './achievementsTemporaryDAL'
import utils from './achievementsTemporaryUtils'
import achievementsTemporaryData from '../achievementsTemporaryData'

const handle = async (interaction, user) => {
  let achievementsData = await achievementsTemporaryData.getAllByInteraction(
    interaction
  )

  for (let data of achievementsData) {
    if (!utils.isBeforeEndDate(data)) return

    let achievement = await service.findOrCreate(data, user)
    if (achievement) await service.update(achievement, user, interaction)
  }
}

const getMessages = async userId => {
  return service.getMessages(userId)
}

const resetEarned = achievement => {
  return service.resetEarned(achievement)
}

const findInactivities = async () => {
  return dal.findAllInactivitiesDaily()
}

export default {
  handle,
  getMessages,
  resetEarned,
  findInactivities
}
