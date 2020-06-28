import mongoose from 'mongoose'

import mongoConfig from '../config/mongodb'
import LogController from '../controllers/LogController'

const { MONGODB_URI, MONGODB_TEST_URI } = process.env

export const connect = async type => {
  try {
    const uri = type === 'test' ? MONGODB_TEST_URI : MONGODB_URI
    return await mongoose.connect(uri, mongoConfig)
  } catch (error) {
    LogController.sendError(error)
    process.exit(1)
  }
}
