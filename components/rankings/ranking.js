import mongoose from 'mongoose'

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
  users: []
})

export default mongoose.model('Ranking', rankingSchema)
