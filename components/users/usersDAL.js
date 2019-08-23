import model from './user'

const save = user => {
  return model(user).save()
}

const find = (query, sort = { _id: 1 }, limit = 99999, skip = 0) => {
  return model
    .find(query)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .exec()
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

const aggregate = async args => {
  return model.aggregate(args).exec()
}

export default {
  find,
  findOne,
  findAll,
  findOneAndUpdate,
  aggregate,
  save
}
