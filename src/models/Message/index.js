import mongoose from 'mongoose'

import messageSchema from './schema'

messageSchema.pre('findOneAndUpdate', function () {
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

messageSchema.statics.createOrUpdate = async function (query, payload) {
  return this.findOneAndUpdate(query, payload, {
    runValidators: true,
    upsert: true,
    setDefaultsOnInsert: true,
    new: true
  })
}

export default mongoose.model('Message', messageSchema)
