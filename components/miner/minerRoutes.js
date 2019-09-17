import express from 'express'
import miner from './minerController'
const router = express.Router()

router.get('/ranking', async (req, res) => {
  const teams = req.headers.teams || 'network'
  const result = await miner.getAllUsers(teams)
  return res.json(result)
})

router.get('/ranking/general', async (req, res) => {
  const { page, limit } = req.query
  const result = await miner.getGeneralRanking({ page, limit })
  return res.json(result)
})

router.get('/ranking/monthly', async (req, res) => {
  const { page, limit } = req.query
  const result = await miner.getMonthlyRanking({ page, limit })
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
