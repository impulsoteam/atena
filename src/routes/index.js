import { Router } from 'express'

import apiRoutes from './api'
import dripRoutes from './drip'

const router = new Router()

router.use('/api/v1', apiRoutes)
router.use('/api/v1/drip', dripRoutes)

export default router
