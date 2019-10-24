import dal from './settingsDAL'

const getValue = async name => {
  const setting = await dal.findByName(name)
  return setting ? setting.value : false
}

const create = (name, value) => {
  return dal.save({ name: name, value: value })
}

export default {
  getValue,
  create
}
