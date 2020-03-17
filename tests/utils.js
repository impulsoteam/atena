import mongoose from 'mongoose'
import mongoConfig from '../src/config/mongodb'

const { MONGODB_URI } = process.env

class Database {
  constructor() {
    this.init()
  }

  async init() {
    mongoose.plugin(schema => {
      schema.pre('findOneAndUpdate', this.setDefaults)
      schema.pre('updateMany', this.setDefaults)
      schema.pre('updateOne', this.setDefaults)
      schema.pre('update', this.setDefaults)
    })
    mongoose.connect('mongodb://localhost/atenaTest', mongoConfig)
  }

  setDefaults() {
    this.setOptions({
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
  }
}

export default new Database()
