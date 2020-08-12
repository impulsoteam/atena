import { Router } from 'express'

import LogController from '../controllers/LogController'
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
    LogController.sendError(error)
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
    LogController.sendError(error)
    res.status(500).json({ error: error.toString() })
  }
})

router.get('/users/:uuid/profile', async (req, res) => {
  console.log('-==========================================')
  console.log('-==========================================')
  console.log(req.get('host'))
  console.log(req.get('origin'))
  console.log(req.socket.remoteAddress)
  console.log('-==========================================')
  console.log('-==========================================')
  try {
    const { uuid } = req.params

    if (!uuid) return res.status(400).json({ error: 'Invalid parameters' })
    const result = await UserController.getProfile(uuid)
    return res.json(result)
  } catch (error) {
    LogController.sendError(error)
    res.status(500).json({ error: error.toString() })
  }
})

export default router
