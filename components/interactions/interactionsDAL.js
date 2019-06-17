import model from './interaction'
import { _today } from '../../helpers'

const save = interaction => {
  return model(interaction).save()
}

const findBy = query => {
  return model.find(query).exec()
}

const findAllFromToday = rocketId => {
  return model
    .find({
      user: rocketId,
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
    'date',
    {
      sort: { _id: -1 }
    }
  )
}

export default {
  findBy,
  findAllFromToday,
  findLastMessageByUser,
  save
}
