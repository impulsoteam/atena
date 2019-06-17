import model from './achievementTemporaryData'

const save = achievement => {
  return model(achievement).save()
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
  save,
  findById,
  findAll,
  findAllByQuery
}
