import express from 'express'
import bodyParser from 'body-parser'
import blogController from '../controllers/blog'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/', async (req, res) => {
  const data = await blogController.index(req.body)
  res.json({ success: data })
})

export default router
