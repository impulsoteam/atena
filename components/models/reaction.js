import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true
    },
    rocketMessageId: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

schema.statics.addOrRemove = async (rocketMessage, localMessage) => {
  // Check if was added or removed
}

export default mongoose.model('Reaction', schema)
