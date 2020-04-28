import mongoose from 'mongoose'

import mongoConfig from '../config/mongodb'
import LogController from '../controllers/LogController'

const { MONGODB_URI } = process.env

export const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongoConfig)
  } catch (error) {
    LogController.sendError(error)
    process.exit(1)
  }
}
