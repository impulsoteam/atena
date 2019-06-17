import dal from './achievementsTemporaryDataDAL'
import service from './achievementsTemporaryDataService'
import utils from './achievementsTemporaryDataUtils'
import errors from '../errors'

const file = 'Achievements Temporary Data | Controller'

const save = data => {
  try {
    const dates = utils.generateDates(data)
    let achievement = {
      name: data.name,
      kind: utils.generateKind(data),
      rangeTime: data.rangeTime,
      initialDate: dates.initialDate,
      limitDate: dates.limitDate,
      endDate: dates.endDate,
      ratings: utils.generateRatings(data.ratings)
    }

    return dal.save(achievement)
  } catch (e) {
    errors._throw(file, 'save', e)
  }
}

const update = async (id, data) => {
  try {
    let temporaryAchievementData = await dal.findById(id)
    if (!temporaryAchievementData) {
      errors._throw(file, 'update', 'Achievement Temporary Data not found')
      return
    }

    const dates = utils.generateDates(data)
    temporaryAchievementData.name = data.name
    temporaryAchievementData.initialDate = dates.initialDate
    temporaryAchievementData.limitDate = dates.limitDate
    temporaryAchievementData.endDate = dates.endDate

    return temporaryAchievementData.save()
  } catch (e) {
    errors._throw(file, 'update', e)
  }
}

const disable = async id => {
  try {
    let achievement = await dal.findById(id)
    if (!achievement) {
      errors._throw(file, 'disable', 'Achievement Temporary Data not found')
      return
    }

    return service.disable(achievement)
  } catch (e) {
    errors._throw(file, 'disable', e)
  }
}

const getById = id => {
  try {
    return dal.findById(id)
  } catch (e) {
    errors._throw(file, 'getById', e)
  }
}

const getAll = () => {
  try {
    return dal.findAll()
  } catch (e) {
    errors._throw(file, 'getAll', e)
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
