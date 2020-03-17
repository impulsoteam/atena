import mongoose from 'mongoose'
import mongoConfig from '../config/mongodb'

class Database {
  async init(mongoUri) {
    mongoose.plugin(schema => {
      schema.pre('findOneAndUpdate', this.setDefaults)
      schema.pre('updateMany', this.setDefaults)
      schema.pre('updateOne', this.setDefaults)
      schema.pre('update', this.setDefaults)
    })
    mongoose.connect(mongoUri, mongoConfig)
  }

  setDefaults() {
    return {
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    }
  }
}

export default new Database()
