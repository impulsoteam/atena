import { Router } from 'express'

import apiRoutes from './api'
import atenaRoutes from './atena'

const router = new Router()

router.use('/api/v1', apiRoutes)
router.use('/api/v2', atenaRoutes)

export default router
