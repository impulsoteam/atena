import cors from 'cors'
import express from 'express'

import { connect as atenaDataBase } from './databases/atena'
import { scheduleJobs } from './jobs'
import routes from './routes'
import { connect as amqp } from './services/amqp'
import { connect as apiRocketchat } from './services/rocketchat/api'
import { connect as driverRocketchat } from './services/rocketchat/driver'

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
    amqp()
    scheduleJobs()
    atenaDataBase()
    apiRocketchat()
    driverRocketchat()
  }
}

export default new App().server
