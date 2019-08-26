import express from 'express'
import bodyParser from 'body-parser'
import controller from './achievementsTemporaryDataController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
  let achievementsTemporaryData = await controller.getAll()
  res.json(achievementsTemporaryData)
})

router.get('/:id', async (req, res) => {
  let achievementTemporaryData = await controller.getById(req.params.id)
  res.json(achievementTemporaryData)
})

router.post('/', async (req, res) => {
  let achievementsTemporaryData = await controller.save(req.body)
  res.json(achievementsTemporaryData)
})

router.put('/:id', async (req, res) => {
  let achievementTemporaryData = await controller.update(
    req.params.id,
    req.body
  )
  res.json(achievementTemporaryData)
})

router.delete('/:id', async (req, res) => {
  let achievementTemporaryData = await controller.disable(req.params.id)
  res.json(achievementTemporaryData)
})

export default router
