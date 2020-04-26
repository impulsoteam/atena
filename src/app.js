import cors from 'cors'
import express from 'express'

import routes from '../src/routes'
import { connect as atenaDataBase } from './databases/atena'
import { exec as jobs } from './jobs'
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
    jobs()
    atenaDataBase()
    apiRocketchat()
    driverRocketchat()
  }
}

export default new App().server
