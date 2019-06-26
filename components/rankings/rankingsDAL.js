import model from './ranking'

const findAll = () => {
  return model.find({}).exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const findOneAndPopulate = (query, path) => {
  return model
    .findOne(query)
    .populate(path)
    .exec()
}

const save = ranking => {
  return model(ranking).save()
}

export default {
  findAll,
  findOne,
  findOneAndPopulate,
  save
}
