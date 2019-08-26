import express from 'express'
import interactions from './interactionsController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.put('/users-id', async (req, res) => {
  console.log('req.body', req.body)
  const result = await interactions.changeUserId(
    req.body.limit || 7000,
    req.body.skip || 0
  )
  return res.json(result)
})

export default router
