import { Router } from 'express'

import apiRoutes from './api'
import minerRoutes from './miner'

const router = new Router()

router.use('/api/v1', apiRoutes)
router.use('/miner', minerRoutes)

export default router
