import config from 'config-yml'
import model from './achievementLevel'

const findAll = () => {
  return model
    .find()
    .populate('user')
    .exec()
}

const findAllByUser = userId => {
  return model.find({ user: userId }).exec()
}

const findByUser = userId => {
  return model
    .findOne({
      user: userId
    })
    .exec()
}

const findMain = () => {
  return config['achievements-network'].level
}

const save = achievement => {
  return model(achievement).save()
}

export default {
  findAll,
  findAllByUser,
  findByUser,
  findMain,
  save
}
