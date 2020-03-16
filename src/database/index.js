import mongoose from 'mongoose'
import mongoConfig from '../config/mongodb'

const { MONGODB_URI } = process.env

class Database {
  constructor() {
    this.init()
  }

  init() {
    mongoose.plugin(schema => {
      schema.pre('findOneAndUpdate', this.setOptions)
      schema.pre('updateMany', this.setOptions)
      schema.pre('updateOne', this.setOptions)
      schema.pre('update', this.setOptions)
    })
    mongoose.connect(MONGODB_URI, mongoConfig)
  }

  setOptions() {
    this.setOptions({
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
  }
}
const ac = new Database()
console.log(new Database())
export default new Database()
