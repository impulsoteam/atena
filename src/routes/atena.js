import { Router } from 'express'

import RankingController from '../controllers/RankingController'
import SessionController from '../controllers/SessionController'
import UserController from '../controllers/UserController'
import { decrypt } from '../services/crypto'

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
  const { ranking } = await RankingController.getGeneralRanking({
    size: 20,
    offset: 0
  })
  return res.json(ranking)
})

router.get('/ranking/monthly', async (req, res) => {
  const { ranking } = await RankingController.getMonthlyRanking({
    size: 20,
    offset: 0
  })
  return res.json(ranking)
})

router.get('/users/:uuid/profile', async (req, res) => {
  const { user, rankings } = await UserController.getProfile(req.params.uuid)

  const response = {
    name: user.name,
    avatar: user.avatar,
    level: user.level.value,
    score: user.score.value,
    userAchievements: [
      {
        name: 'Network',
        achievements: []
      }
    ]
  }

  if (user.isCoreTeam) {
    response.generalPosition = 'coreTeam'
    response.monthlyPosition = 'coreTeam'
  } else {
    response.generalPosition = rankings.general.position
    response.monthlyPosition = rankings.monthly.position
  }

  return res.json(response)
})

export default router
