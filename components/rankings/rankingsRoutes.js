import express from 'express'
import rankings from './rankingsController'

const router = express.Router()

router.get('/general', async (req, res) => {
  const { page, limit } = req.query
  const result = await rankings.getGeneralRanking({ page, limit })
  return res.json(result)
})

router.get('/monthly', async (req, res) => {
  const { year, month, page, limit } = req.query
  const result = await rankings.getMonthlyRanking({ year, month, page, limit })
  return res.json(result)
})

export default router
