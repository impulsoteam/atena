import config from 'config-yml'
import model from './achievement'

const findAllByUser = async userId => {
  return await model.find({ user: userId }).exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const save = achievement => {
  return model(achievement).save()
}

// TODO: export to settings
const findMain = (category, action, type) => {
  let achievements = null
  if (
    config.hasOwnProperty(`achievements-${category}`) &&
    config[`achievements-${category}`].hasOwnProperty(action) &&
    config[`achievements-${category}`][action].hasOwnProperty(type)
  ) {
    achievements = config[`achievements-${category}`][action][type]
  }

  return achievements
}

export default {
  findAllByUser,
  findMain,
  findOne,
  save
}
