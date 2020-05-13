import moment from 'moment'
import mongoose from 'mongoose'

import scoreSchema from './schema'

scoreSchema.statics.getDailyScore = async function(uuid) {
  const result = await this.aggregate([
    {
      $match: {
        user: uuid,
        $and: [
          {
            createdAt: {
              $gte: moment()
                .startOf('day')
                .toDate()
            }
          },
          {
            createdAt: {
              $lte: moment()
                .endOf('day')
                .toDate()
            }
          }
        ]
      }
    },
    {
      $group: {
        _id: '',
        score: { $sum: '$score' }
      }
    },
    {
      $project: {
        _id: 0,
        score: '$score'
      }
    }
  ])

  return result[0] && result[0].score ? result[0].score : 0
}

scoreSchema.statics.findAllByMonth = async function({ date, offset, size }) {
  const formattedDate = date || moment().toDate()

  const startDate = moment(formattedDate)
    .startOf('month')
    .toDate()
  const endDate = moment(formattedDate)
    .endOf('month')
    .toDate()

  const query = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $group: {
        _id: '$user',
        score: { $sum: '$score' }
      }
    },
    {
      $match: {
        score: { $gt: 0 }
      }
    }
  ]
  const count = await this.aggregate([...query, { $count: 'count' }])

  const ranking = await this.aggregate([
    ...query,
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'uuid',
        as: 'user'
      }
    },
    {
      $match: {
        'user.isCoreTeam': false
      }
    },
    {
      $sort: { score: -1 }
    },
    {
      $unwind: '$user'
    },
    {
      $addFields: {
        name: '$user.name',
        avatar: '$user.avatar',
        level: '$user.level.value',
        uuid: '$user.uuid',
        rocketchat: '$user.rocketchat'
      }
    },
    {
      $project: {
        user: 0
      }
    },
    { $skip: parseInt(offset) },
    { $limit: parseInt(size) }
  ])

  const total = count.length ? count[0].count : 0

  return { total, ranking }
}

export default mongoose.model('Score', scoreSchema)
