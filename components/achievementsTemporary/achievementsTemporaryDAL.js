import moment from 'moment-timezone'
import model from './achievementTemporary'

const findByUser = async userId => {
  return await model
    .findOne({ user: userId })
    .populate({
      path: 'temporaryData',
      match: { endDate: { $gte: moment(new Date()).format('YYYY-MM-DD') } }
    })
    .exec()
}

const findAllByUser = async userId => {
  return await model
    .find({ user: userId })
    .populate({
      path: 'temporaryData',
      match: { endDate: { $gte: moment(new Date()).format('YYYY-MM-DD') } }
    })
    .exec()
}

const findOne = async query => {
  return await model.findOne(query).exec()
}

const getAllInactivitiesDaily = async () => {
  const achievements = await model
    .find({
      lastEarnedDate: {
        $gte: moment(new Date())
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        $lte: moment(new Date()).format('YYYY-MM-DD')
      }
    })
    .exec()

  return achievements
}

export default {
  findAllByUser,
  findByUser,
  findOne,
  getAllInactivitiesDaily
}
