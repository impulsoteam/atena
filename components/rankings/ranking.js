import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: false
  }
})

const rankingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  closed: {
    type: Boolean,
    required: false,
    default: false
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isCoreTeam: {
    type: Boolean,
    required: true,
    default: false
  },
  users: [userSchema]
})

export default mongoose.model('Ranking', rankingSchema)
