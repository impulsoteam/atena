import mongoose from 'mongoose'

export const providers = {
  rocketchat: 'rocketchat'
}

const provider = {
  name: {
    type: String,
    enum: Object.values(providers)
  },
  messageId: {
    type: String,
    required: true
  },
  room: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  username: {
    type: String,
    required: true
  }
}

const reactionSchema = new mongoose.Schema(
  {
    user: String,
    content: {
      type: String,
      required: true
    },
    provider
  },
  { timestamps: true }
)

export default mongoose.model('Reaction', reactionSchema)
