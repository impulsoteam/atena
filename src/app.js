import express from 'express'
import cors from 'cors'
import routes from '../src/routes'
import Mongo from './database/Mongo'
import { connect as driverRocketchat } from './services/rocketchat/driver'
import { connect as apiRocketchat } from './services/rocketchat/api'
import { connect as amqp } from './services/amqp'
const { MONGODB_URI } = process.env
class App {
  constructor() {
    this.server = express()
    this.middlewares()
    this.routes()
    this.services()
  }

  middlewares() {
    this.server.use(express.json())
    this.server.use(cors())
  }

  routes() {
    this.server.use(routes)
  }

  async services() {
    driverRocketchat()
    apiRocketchat()
    amqp()
    Mongo.init(MONGODB_URI)
  }
}

export default new App().server
