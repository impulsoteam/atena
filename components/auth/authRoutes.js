import express from 'express'
import controller from './authController'

const router = express.Router()

router.get('/error', controller.error)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

export default router
