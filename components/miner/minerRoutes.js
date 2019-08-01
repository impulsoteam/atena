import express from 'express'
import miner from './minerController'
const router = express.Router()

router.get('/ranking', async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const limit = req.headers.limit ? req.headers.limit : 9999999
  const result = await miner.getAllUsers(team, limit)
  return res.json(result)
})

router.get('/ranking/geral', async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const limit = req.headers.limit ? req.headers.limit : 9999999
  const result = await miner.getGeneralRanking(team, limit)
  return res.json(result)
})

router.get('/ranking/mes/:month', async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const result = await miner.getRankingByMonth(req.params.month, team)
  return res.json(result)
})

router.get('/mostactive', async (req, res) => {
  const result = await miner.getMostActiveUsers(
    req.headers.begin,
    req.headers.end
  )
  return res.json(result)
})

export default router
