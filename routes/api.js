import express from 'express'
import bodyParser from 'body-parser'

import userController from '../controllers/user'
import rankingController from '../controllers/ranking'

const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/slack-users', userController.getSlackUsers)
router.get('/find', userController.findByName)
router.put('/edit-score/:id', userController.editScore)

router.get('/ranking-monthly', rankingController.index)
router.get('/ranking-general', rankingController.general)

export default router
