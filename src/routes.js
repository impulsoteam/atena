import { Router } from 'express'

import RankingController from './controllers/RankingsController'
import LevelHistory from './models/LevelHistory'
import Message from './models/Message'
import User from './models/User'
import Reaction from './models/Reaction'
import Score from './models/Score'

const routes = new Router()

routes.get('/', async (req, res) => {
  const a = await RankingController.getGeneralRanking({})
  console.log(a)
  return res.json({ a })
})

routes.post('/', (req, res) => {
  return res.status(201).json({ message: 'ok' })
})

routes.put('/', async (req, res) => {
  await LevelHistory.deleteMany({})
  await Message.deleteMany({})
  await User.deleteMany({})
  await Reaction.deleteMany({})
  await Score.deleteMany({})
  return res.json({ message: 'ok' })
})

export default routes
