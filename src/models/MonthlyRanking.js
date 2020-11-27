import mongoose from 'mongoose'

const monthlyRankingSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: String,
    level: {
      type: Number,
      required: true
    },
    rocketchat: {
      id: {
        type: String
      },
      username: {
        type: String
      }
    },
    score: {
      type: Number,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

monthlyRankingSchema.index({ uuid: 1 })

monthlyRankingSchema.statics.getCurrentRanking = async function ({
  offset = 0,
  size = 99999
}) {
  const ranking = await this.find({})
    .sort({ position: 1 })
    .skip(parseInt(offset))
    .limit(parseInt(size))
  const total = await this.countDocuments({})

  return { ranking, total }
}

monthlyRankingSchema.statics.getUserPosition = async function (uuid) {
  const ranking = await this.findOne({ uuid })

  if (!ranking) {
    return {
      position: 0,
      score: 0
    }
  } else {
    return ranking
  }
}

monthlyRankingSchema.statics.updateUserRanking = async function ({
  user,
  position
}) {
  const { uuid, score, name, avatar, level, rocketchat } = user

  await this.findOneAndUpdate(
    { uuid },
    {
      uuid,
      score,
      name,
      avatar,
      level,
      rocketchat,
      position
    },
    {
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    }
  )
}

export default mongoose.model('MonthlyRanking', monthlyRankingSchema)
