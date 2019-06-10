import dal from './achievementsTemporaryDataDAL'
import service from './achievementsTemporaryDataService'
import utils from './achievementsTemporaryDataUtils'

export const save = async data => {
  try {
    const dates = utils.generateDates(data)
    let achievement = {
      name: data.name,
      kind: utils.generateKind(data),
      rangeTime: data.rangeTime,
      initialDate: dates.initialDate,
      limitDate: dates.limitDate,
      endDate: dates.endDate,
      ratings: utils.generateRatingsRanges(data.ratings)
    }

    return await dal.create(achievement)
  } catch (error) {
    console.log('Error saving achievement temporary data')
  }
}

export const update = async (data, id) => {
  try {
    let temporaryAchievementData = await dal.findById(id)
    if (!temporaryAchievementData) {
      console.log(
        'Error not found temporaryAchievementData on update achievement temporary data'
      )
    }

    const dates = utils.generateDates(data)
    temporaryAchievementData.name = data.name
    temporaryAchievementData.initialDate = dates.initialDate
    temporaryAchievementData.limitDate = dates.limitDate
    temporaryAchievementData.endDate = dates.endDate

    temporaryAchievementData.save()
  } catch (error) {
    console.log('Error update achievement temporary data')
  }
}

export const disable = async id => {
  try {
    let achievement = await dal.findById(id)
    if (!achievement) {
      console.log(
        'Error not found achievement on update achievement temporary data'
      )
    }

    return await service.disable(achievement)
  } catch (error) {
    console.log('Error on disable achievement temporary data')
  }
}

export const getById = id => {
  try {
    return dal.findById(id)
  } catch (error) {
    console.log('Error getById achievement temporary data')
  }
}

export const getAll = () => {
  try {
    return dal.findAll()
  } catch (error) {
    console.log('Error getAll achievement temporary data')
  }
}

const getByInteraction = interaction => {
  const query = service.getQueryToFindCurrent(interaction)
  return dal.findAllByQuery(query)
}

export default {
  save,
  update,
  disable,
  getById,
  getAll,
  getByInteraction
}
