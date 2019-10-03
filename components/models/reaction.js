import mongoose from 'mongoose'

const rocketData = {
  messageId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true }
}

const schema = new mongoose.Schema(
  {
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    rocketData
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
)

export default mongoose.model('Reaction', schema)
