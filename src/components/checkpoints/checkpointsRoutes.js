import express from 'express'
import checkpoints from './checkpointsController'

const router = express.Router()

// router.get('/', checkpointController.index)
// router.get('/novo', checkpointController.new_record)
// router.get('/editar/:id', checkpointController.edit)
// router.post('/save/:id', checkpointController.update)
// router.get('/apagar/:id', checkpointController.delete_record)

router.get('/', async (req, res) => {
  const result = await checkpoints.getAll()
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const result = await checkpoints.getById(req.params.id)
  return res.json(result)
})

router.put('/:id', async (req, res) => {
  const result = await checkpoints.update(req.params.id, req.body)
  return res.json(result)
})

router.delete('/:id', async (req, res) => {
  const result = await checkpoints.remove(req.params.id)
  return res.json(result)
})

router.post('/', async (req, res) => {
  const result = await checkpoints.create(req.body)
  return res.json(result)
})

export default router
