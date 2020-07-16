import { Router } from 'express'

import { handleDripEvent } from '../services/drip'

const router = new Router()

router.post('/events', (req, res) => {
  handleDripEvent(req.body)
  return res.json({ message: 'Event sent to be processed' })
})

export default router
