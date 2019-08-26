import express from 'express'
import interactions from './interactionsController'

const router = express.Router()

router.put('/users-id', async (req, res) => {
  console.log('req.body', req.body)
  const result = await interactions.changeUserId(
    req.body.limit || 14000,
    req.body.skip || 7000
  )
  return res.json(result)
})

export default router
