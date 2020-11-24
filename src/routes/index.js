import { Router } from 'express'

import apiRoutes from './api'

const router = new Router()

router.use('/api/v1', apiRoutes)

export default router
