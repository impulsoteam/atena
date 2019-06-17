import model from './user'

const save = user => {
  return model(user).save()
}

const findBy = query => {
  return model.find(query).exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const findAll = (query, select, limit, sort) => {
  return model
    .find(query)
    .sort(sort)
    .limit(limit)
    .select(select)
    .exec()
}

const findOneAndUpdate = async (query, args, options) => {
  return model.findOneAndUpdate(query, args, options).exec()
}

export default {
  findBy,
  findOne,
  findAll,
  findOneAndUpdate,
  save
}
