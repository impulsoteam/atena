import model from './checkpoint'

const findAll = () => {
  return model.find({}).exec()
}

const find = query => {
  return model.find(query).exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const save = checkpoint => {
  return model(checkpoint).save()
}

const deleteOne = query => {
  return model.deleteOne(query)
}

export default {
  findAll,
  find,
  findOne,
  save,
  deleteOne
}
