import model from './setting'

const findByName = name => {
  return model.findOne({ name: name }).exec()
}

const save = setting => {
  return model(setting).save()
}

export default {
  findByName,
  save
}
