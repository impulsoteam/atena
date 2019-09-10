import mongoose from 'mongoose'

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  channelName: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thread: {
    type: Boolean,
    required: true,
    default: false
  },
  messageIdentifier: {
    type: String,
    required: false
  },
  parentMessage: {
    type: String,
    required: false
  },
  parentUser: {
    type: String,
    required: false
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  score: {
    type: Number,
    default: 0
  },
  messageId: {
    type: String
  }
})

export default mongoose.model('Interaction', interactionSchema)
