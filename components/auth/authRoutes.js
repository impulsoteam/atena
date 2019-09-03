import express from 'express'
import controller from './authController'
import crypto from '../crypto'

const router = express.Router()

router.post('/', async (req, res) => {
  const { user, password } = await crypto.decrypt(req.body.data)

  const result = await controller.auth({
    type: 'rocket',
    user,
    password
  })
  return result.error ? res.status(500).json(result) : res.json(result)
})

router.post('/linkedin', async (req, res) => {
  const result = await controller.auth({
    type: 'linkedin',
    code: req.body.code
  })

  return result.error ? res.status(500).json(result) : res.json(result)
})

export default router
