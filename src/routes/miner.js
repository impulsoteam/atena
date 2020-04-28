import { Router } from 'express'

import RankingController from '../controllers/RankingController'
import UserController from '../controllers/UserController'

const router = new Router()

router.get('/ranking', async (req, res) => {
  const result = await UserController.getEveryoneWhoScored()
  return res.json(result)
})

router.get('/ranking/general', async (req, res) => {
  const { page, limit } = req.query
  const result = await RankingController.getGeneralRanking({ page, limit })
  return res.json(result)
})

router.get('/ranking/monthly', async (req, res) => {
  const { page, limit } = req.query
  const result = await RankingController.getMonthlyRanking({ page, limit })
  return res.json(result)
})

router.get('/user/infos/:uuid', async (req, res) => {
  try {
    const response = await UserController.getUserInfos(req.params.uuid)
    return res.json(response)
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Error while fetch data for ${req.params.uuid}` })
  }
})

export default router
