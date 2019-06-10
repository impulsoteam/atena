import model from './achievementLevel'

const findAll = async () => {
  return await model
    .find()
    .populate('user')
    .exec()
}

const findAllByUser = async userId => {
  return await model.find({ user: userId }).exec()
}

const findByUser = async userId => {
  return await model
    .findOne({
      user: userId
    })
    .exec()
}

export default {
  findAll,
  findAllByUser,
  findByUser
}
