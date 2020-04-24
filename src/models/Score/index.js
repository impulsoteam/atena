import mongoose from 'mongoose'
import moment from 'moment'
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

scoreSchema.statics.findAllByMonth = async function({ date, limit, page }) {
  const formattedDate = date || moment().toDate()
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment(formattedDate)
            .startOf('month')
            .toDate(),
          $lt: moment(formattedDate)
            .endOf('month')
            .toDate()
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
    },
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
        rocketId: '$user.rocketchat.id',
        name: '$user.name',
        avatar: '$user.avatar',
        level: '$user.level.value',
        uuid: '$user.uuid',
        username: '$user.rocketchat.username'
      }
    },
    {
      $project: {
        user: 0
      }
    },
    { $skip: page && limit ? parseInt(page) * parseInt(limit || 50) : 0 },
    { $limit: parseInt(limit) || 99999 }
  ])
}

export default mongoose.model('Score', scoreSchema)
