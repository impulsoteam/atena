import express from 'express'
import users from './usersController'

const router = express.Router()

router.get('/', async (req, res) => {
  console.log('req.query', req.query)
  let result = {}
  if (req.query.slack) {
    result = await users.findUsersWithSlack()
  } else if (req.query.name) {
    result = await users.findRocketUsersByName(req.query.name)
  }

  return res.json(result)
})

export default router
