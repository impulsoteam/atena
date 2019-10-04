import dal from './loginsDAL'

const findOne = conditions => dal.findOne(conditions)

const create = document => dal.create(document)

export default {
  findOne,
  create
}
