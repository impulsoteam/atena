import express from 'express'
import users from './usersController'

const router = express.Router()

router.get('/', async (req, res) => {
  let result = {}
  if (req.query.slack) {
    result = await users.findUsersWithSlack()
  } else if (req.query.name) {
    result = await users.findRocketUsersByName(req.query.name)
  }

  return res.json(result)
})

router.put('/:id/score', async (req, res) => {
  const { type, score } = req.body
  const result = await users.transferScore(req.params.id, type, score)
  return res.json(result)
})

export default router
