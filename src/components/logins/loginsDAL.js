import model from './login'

const findOne = conditions => model.findOne(conditions)

const create = document => model.create(document)

export default {
  findOne,
  create
}
