import { Router } from 'express'
import { sendError } from 'log-on-slack'

import RankingController from '../controllers/RankingController'
import UserController from '../controllers/UserController'

const router = new Router()

router.get('/ranking/general', async (req, res) => {
  try {
    const { offset, size } = req.query

    if (!offset || !size)
      return res.status(400).json({ error: 'Invalid parameters' })

    const response = await RankingController.getGeneralRanking({ offset, size })
    return res.json(response)
  } catch (error) {
    sendError({
      file: 'routes/api.js GET:/ranking/general',
      payload: { ...req.query },
      error
    })
    res.status(500).json({ error: error.toString() })
  }
})

router.get('/ranking/monthly', async (req, res) => {
  try {
    const { year, month, offset, size } = req.query

    if (!offset || !size)
      return res.status(400).json({ error: 'Invalid parameters' })

    const result = await RankingController.getMonthlyRanking({
      year,
      month,
      offset,
      size
    })
    return res.json(result)
  } catch (error) {
    sendError({
      file: 'routes/api.js GET:/ranking/monthly',
      payload: { ...req.query },
      error
    })
    res.status(500).json({ error: error.toString() })
  }
})

router.get('/users/:uuid/profile', async (req, res) => {
  try {
    const { uuid } = req.params

    if (!uuid) return res.status(400).json({ error: 'Invalid parameters' })
    const result = await UserController.getProfile(uuid)
    return res.json(result)
  } catch (error) {
    sendError({
      file: 'routes/api.js GET:/users/:uuid/profile',
      payload: { ...req.params },
      error
    })
    res.status(500).json({ error: error.toString() })
  }
})

export default router
