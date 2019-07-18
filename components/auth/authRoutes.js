import express from 'express'
import controller from './authController'

const router = express.Router()

router.post('/', async (req, res) => {
  const result = await controller.auth({ type: 'rocket', code: req.body.code })
  return result.error ? res.status(401).json(result) : res.json(result)
})

router.post('/linkedin', async (req, res) => {
  const result = await controller.auth({
    type: 'linkedin',
    code: req.body.code
  })
  return result.error ? res.status(401).json(result) : res.json(result)
})

export default router
