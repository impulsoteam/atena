import { Router } from 'express'

import ImpulserController from './controllers/ImpulserController'
import RankingController from './controllers/RankingsController'
const routes = new Router()

routes.get('/', async (req, res) => {
  const a = await RankingController.getGeneralRanking({})
  console.log(a)
  return res.json({ a })
})

routes.post('/', (req, res) => {
  ImpulserController.create(req.body)
  return res.status(201).json({ message: 'ok' })
})

export default routes
