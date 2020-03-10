import express from 'express'

import routes from '../src/routes'
import './database'
import { connect as driverRocketchat } from './services/rocketchat/driver'
import { connect as apiRocketchat } from './services/rocketchat/api'

class App {
  constructor() {
    this.server = express()
    this.middlewares()
    this.routes()
    this.services()
  }

  middlewares() {
    this.server.use(express.json())
  }

  routes() {
    this.server.use(routes)
  }

  async services() {
    driverRocketchat()
    apiRocketchat()
  }
}

export default new App().server
