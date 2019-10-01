import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rocketMessageId: {
      type: String,
      required: true,
      unique: true
    },
    parent: {
      messageId: {
        type: mongoose.Schema.Types.ObjectId
      },
      rocketMessageId: {
        type: String
      }
    },
    thread: {
      type: Boolean,
      default: false
    },
    roomId: {
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

export default mongoose.model('Message', schema)
