import express from 'express'
import users from './usersController'

const router = express.Router()

router.get('/:uuid/profile', async (req, res) => {
  const result = await users.getUserProfileByUuid(req.params.uuid)
  return res.json(result)
})

export default router
