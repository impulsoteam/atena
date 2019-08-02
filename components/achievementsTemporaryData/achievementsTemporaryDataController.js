import dal from './achievementsTemporaryDataDAL'
import service from './achievementsTemporaryDataService'
import utils from './achievementsTemporaryDataUtils'
import errors from '../errors'

const file = 'Achievements Temporary Data | Controller'

const save = data => {
  try {
    const dates = utils.generateDates(data)
    let achievementData = {
      name: data.name,
      kind: utils.generateKind(data),
      rangeTime: data.rangeTime,
      initialDate: dates.initialDate,
      limitDate: dates.limitDate,
      endDate: dates.endDate,
      ratings: utils.generateRatings(data.ratings)
    }

    return dal.save(achievementData)
  } catch (e) {
    errors._throw(file, 'save', e)
  }
}

const update = async (id, data) => {
  try {
    let achievementData = await dal.findById(id)
    if (!achievementData) {
      errors._throw(file, 'update', 'Achievement Temporary Data not found')
      return
    }

    const dates = utils.generateDates(data)
    achievementData.name = data.name
    achievementData.initialDate = dates.initialDate
    achievementData.limitDate = dates.limitDate
    achievementData.endDate = dates.endDate

    return achievementData.save()
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

const getAllByInteraction = interaction => {
  return service.getAllByInteraction(interaction)
}

export default {
  save,
  update,
  disable,
  getById,
  getAll,
  getAllByInteraction
}
