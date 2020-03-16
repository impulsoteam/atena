import mongoose from 'mongoose'

export const providers = {
  rocketchat: 'rocketchat'
}

export const scoreTypes = {
  messageSent: 'messageSent',
  threadAnswered: 'threadAnswered',
  newAchievement: 'newAchievement'
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

export default mongoose.model('Score', scoreSchema)
