import moment from 'moment-timezone'
import model from './achievementTemporary'

const populateData = {
  path: 'temporaryData',
  match: { endDate: { $gte: moment(new Date()).format('YYYY-MM-DD') } }
}

const findByUser = userId => {
  return model
    .findOne({ user: userId })
    .populate(populateData)
    .exec()
}

const findAllByUser = userId => {
  return model
    .find({ user: userId })
    .populate(populateData)
    .exec()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const findAllInactivitiesDaily = () => {
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
  findAllInactivitiesDaily,
  save
}
