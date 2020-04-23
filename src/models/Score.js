import mongoose from 'mongoose'
import moment from 'moment'
export const providers = {
  rocketchat: 'rocketchat'
}

export const scoreTypes = {
  messageSent: 'messageSent',
  threadAnswered: 'threadAnswered',
  newAchievement: 'newAchievement',
  inactivity: 'inactivity',
  manual: 'manual'
}
const scoreSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      enum: Object.values(scoreTypes)
    },
    user: {
      type: String,
      required: true
    },
    details: {
      provider: String,
      messageId: String,
      sender: String,
      room: Object,
      achievement: String,
      medal: String,
      range: String
    }
  },
  {
    timestamps: true
  }
)
scoreSchema.statics.getDailyScore = async function(uuid) {
  const [{ score }] = await this.aggregate([
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

  return score
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
