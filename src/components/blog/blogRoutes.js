import express from 'express'
import bodyParser from 'body-parser'
import controller from './blogController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/', async (req, res) => {
  const data = await controller.save(req.body)
  res.json({ success: data })
})

export default router
