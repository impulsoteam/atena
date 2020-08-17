import mongoose from 'mongoose'

import mongoConfig from '../config/mongodb'
import { sendError } from '../services/log'

const { MONGODB_URI, MONGODB_TEST_URI } = process.env

export const connect = async type => {
  try {
    const uri = type === 'test' ? MONGODB_TEST_URI : MONGODB_URI
    return await mongoose.connect(uri, mongoConfig)
  } catch (error) {
    sendError({
      file: 'database/atena.js - connect',
      payload: type,
      error
    })
    process.exit(1)
  }
}
