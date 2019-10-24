import express from 'express'
import bodyParser from 'body-parser'
import github from './githubController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/events', async (req, res) => {
  const result = await github.handle(req.body)
  return res.json(result)
})

router.get('/callback', async (req, res) => {
  const githubId = req.query.code
  const rocketId = req.query.state
  const result = await github.addUser(githubId, rocketId)
  return res.redirect(result.redirect)
})

// router.use("/", githubController.index);

export default router
