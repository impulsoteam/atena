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

messageSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate()
  if (update.__v != null) {
    delete update.__v
  }
  const keys = ['$set', '$setOnInsert']
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v
      if (Object.keys(update[key]).length === 0) {
        delete update[key]
      }
    }
  }
  update.$inc = update.$inc || {}
  update.$inc.__v = 1
})

export default mongoose.model('Message', messageSchema)
