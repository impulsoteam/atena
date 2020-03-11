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
  parentId: String,
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
  user: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
const messageSchema = new mongoose.Schema({
  user: String,
  content: {
    type: String,
    required: true
  },
  threadCount: {
    type: Number,
    required: true
  },
  reactionCount: {
    type: Number,
    required: true
  },
  provider,
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
})

export default mongoose.model('Message', messageSchema)
