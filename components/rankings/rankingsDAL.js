import model from './ranking'

const findOne = query => {
  return model.findOne(query).exec()
}

export default {
  findOne
}
