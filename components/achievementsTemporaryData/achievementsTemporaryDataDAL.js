import model from './achievementTemporaryData'

const create = achievement => {
  const achievementTemporaryData = new model(achievement)
  return achievementTemporaryData.save()
}

const findById = id => {
  return model.findById(id).exec()
}

const findAll = () => {
  return model.find({}).exec()
}

const findAllByQuery = query => {
  return model.find(query).exec()
}

export default {
  create,
  findById,
  findAll,
  findAllByQuery
}
