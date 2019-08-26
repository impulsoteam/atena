import express from 'express'
import interactions from './interactionsController'

const router = express.Router()

router.put('/users-id', async (req, res) => {
  const result = await interactions.changeUserId(req.body.limit, req.body.skip)
  return res.json(result)
})

export default router
