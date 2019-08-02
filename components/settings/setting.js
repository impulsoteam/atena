import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

settingSchema.pre('save', function(next) {
  this.lastUpdate = Date.now
  next()
})

export default mongoose.model('Setting', settingSchema)
