import model from './user'

const findOne = query => {
  return model.findOne(query).exec()
}

export default {
  findOne
}
