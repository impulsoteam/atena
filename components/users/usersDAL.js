import model from './user'

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

export default {
  findBy,
  findOne,
  findAll
}
