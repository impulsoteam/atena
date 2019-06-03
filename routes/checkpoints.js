import express from 'express'
import checkpointController from '../controllers/checkpoint'
const router = express.Router()

router.get('/', checkpointController.index)
router.get('/novo', checkpointController.new_record)
router.get('/editar/:id', checkpointController.edit)
router.post('/save', checkpointController.save)
router.post('/save/:id', checkpointController.update)
router.get('/apagar/:id', checkpointController.delete_record)

export default router
