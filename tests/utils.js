import mongoose from 'mongoose'
import mongoConfig from '../src/config/mongodb'

const setOptions = () => ({
  runValidators: true,
  upsert: true,
  setDefaultsOnInsert: true,
  new: true
})
export const connect = async type => {
  mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setOptions)
    schema.pre('updateMany', setOptions)
    schema.pre('updateOne', setOptions)
    schema.pre('update', setOptions)
  })
  return mongoose.connect(`mongodb://localhost/${type}`, mongoConfig)
}
