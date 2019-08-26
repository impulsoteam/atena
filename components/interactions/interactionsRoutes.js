import express from 'express'
import interactions from './interactionsController'

const router = express.Router()

router.put('/users-id', async (req, res) => {
  const result = await interactions.changeUserId(
    req.body.limit || 14000,
    req.body.skip || 700
  )
  return res.json(result)
})

export default router
