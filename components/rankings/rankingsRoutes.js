import express from 'express'
import rankings from './rankingsController'

const router = express.Router()

router.get('/general', async (req, res) => {
  const result = await rankings.getGeneralRanking({})
  return res.json(result)
})

router.get('/monthly', async (req, res) => {
  const { year, month } = req.query
  const result = await rankings.getMonthlyRanking({ year, month })
  return res.json(result)
})

export default router
