import { Router } from 'express'
import { decrypt } from '../services/crypto'

import RankingController from '../controllers/RankingController'
import SessionController from '../controllers/SessionController'
import UserController from '../controllers/UserController'

const router = new Router()

router.post('/auth', async (req, res) => {
  const { user, password } = await decrypt(req.body.data)

  const result = await SessionController.rocketchat(user, password)
  return result.error ? res.status(500).json(result) : res.json(result)
})

router.post('/auth/linkedin', async (req, res) => {
  const result = await SessionController.linkedin(req.body.code)

  return result.error ? res.status(500).json(result) : res.json(result)
})

router.get('/ranking/general', async (req, res) => {
  const { page, limit } = req.query
  const result = await RankingController.getGeneralRanking({ page, limit })
  return res.json(result)
})

router.get('/ranking/monthly', async (req, res) => {
  const { year, month, page, limit } = req.query
  const result = await RankingController.getMonthlyRanking({
    year,
    month,
    page,
    limit
  })
  return res.json(result)
})

router.get('/users/:uuid/profile', async (req, res) => {
  const result = await UserController.getProfile(req.params.uuid)
  return res.json(result)
})

export default router
