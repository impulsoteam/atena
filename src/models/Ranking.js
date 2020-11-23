import mongoose from 'mongoose'

const rankingSchema = new mongoose.Schema(
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

rankingSchema.index({ uuid: 1 })

export default mongoose.model('Ranking', rankingSchema)
