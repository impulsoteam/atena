import express from 'express'
import rankings from './rankingsController'

const router = express.Router()

router.get('/general', async (req, res) => {
  let result = await rankings.getGeneralRanking()
  return res.json(result)
})

router.get('/monthly', async (req, res) => {
  let result = await rankings.getRankingByMonth(req.query.month)
  return res.json(result)
})

router.post('/monthly', async (req, res) => {
  let result = await rankings.generate(req.body.month)
  return res.json(result)
})

export default router
