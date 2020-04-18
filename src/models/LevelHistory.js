import mongoose from 'mongoose'

const levelHistorySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    level: {
      previous: {
        type: Number,
        required: true
      },
      current: {
        type: Number,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('LevelHistory', levelHistorySchema)
