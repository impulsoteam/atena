import { Router } from 'express'
import apiRoutes from './api'
import minerRoutes from './miner'
import BotController from '../controllers/BotController'

const router = new Router()

router.get('/', BotController.sendMonthlyRankingToChannel)

router.use('/api/v1', apiRoutes)
router.use('/miner', minerRoutes)

export default router
