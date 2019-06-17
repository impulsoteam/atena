import dal from './settingsDAL'

const getValue = name => {
  return dal.findByName(name)
}

const create = (name, value) => {
  return dal.save({ name: name, value: value })
}

export default {
  getValue,
  create
}
