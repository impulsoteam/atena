import express from 'express'
const router = express.Router()

router.post('/messages', async (req, res) => {
  console.log(req.body)

  res.json('rocket messages')
})

export default router
