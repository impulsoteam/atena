import model from './interaction'
import { _today } from '../../helpers'

const save = interaction => {
  return model(interaction).save()
}

const findOne = query => {
  return model.findOne(query).exec()
}

const findOneAndUpdate = (query, args, options) => {
  return model.findOneAndUpdate(query, args, options).exec()
}

const updateMany = (query, args, options) => {
  return model.updateMany(query, args, options).exec()
}

const find = query => {
  return model.find(query).exec()
}

const findAllFromToday = userId => {
  return model
    .find({
      user: userId,
      date: {
        $gte: _today.start
      }
    })
    .exec()
}

const findLastMessageByUser = userId => {
  return model.findOne(
    {
      user: userId,
      type: 'message'
    },
    {},
    {
      sort: { _id: -1 }
    }
  )
}

const aggregate = args => {
  return model.aggregate(args).exec()
}

export default {
  find,
  findOne,
  findOneAndUpdate,
  findAllFromToday,
  findLastMessageByUser,
  updateMany,
  save,
  aggregate
}
