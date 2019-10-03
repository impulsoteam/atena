import mongoose from 'mongoose'

const rocketData = {
  messageId: { type: String, required: true },
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  parent: { type: String }
}

const is = {
  thread: { type: Boolean, default: false },
  command: { type: Boolean, default: false }
}

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      text: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Message'
    },
    rocketData,
    is
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Message', schema)
