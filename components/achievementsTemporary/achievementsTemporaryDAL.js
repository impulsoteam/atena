import moment from 'moment-timezone'
import model from './achievementTemporary'

const findByUser = userId => {
  return model
    .findOne({ user: userId })
    .populate({
      path: 'temporaryData',
      match: { endDate: { $gte: moment(new Date()).format('YYYY-MM-DD') } }
    })
    .exec()
}

const findAllByUser = userId => {
  return model
    .find({ user: userId })
    .populate({
      path: 'temporaryData',
      match: { endDate: { $gte: moment(new Date()).format('YYYY-MM-DD') } }
    })
    .exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const getAllInactivitiesDaily = () => {
  return model
    .find({
      lastEarnedDate: {
        $gte: moment(new Date())
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        $lte: moment(new Date()).format('YYYY-MM-DD')
      }
    })
    .exec()
}

const save = achievement => {
  return model(achievement).save()
}

export default {
  findAllByUser,
  findByUser,
  findOne,
  getAllInactivitiesDaily,
  save
}
