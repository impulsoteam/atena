import { Router } from 'express'

import { handleEvent } from '../services/drip'

const router = new Router()

router.post('/events', handleEvent)

export default router
