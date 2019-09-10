import mongoose from 'mongoose'
import logs from '../logs'

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
  }
})

interactionSchema.post('save', async function(doc) {
  if (doc.type !== 'inactivity') {
    const userModel = mongoose.model('User')
    const filter = { _id: doc.user }
    const update = { lastInteraction: Date.now() }
    try {
      await userModel.findOneAndUpdate(filter, update)
    } catch (error) {
      logs.info(`Error on save lastUpdate for ${doc.user}`)
    }
  }
})

export default mongoose.model('Interaction', interactionSchema)
