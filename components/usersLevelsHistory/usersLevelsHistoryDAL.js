import model from './userLevelHistory'

const findOne = query => {
  return model.findOne(query).exec()
}

const save = history => {
  return model(history).save()
}

export default {
  findOne,
  save
}
