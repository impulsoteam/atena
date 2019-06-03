import express from 'express'
import bodyParser from 'body-parser'
import { events } from '../components/github'
import githubController from '../controllers/github'
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.post('/events', events)
router.get('/callback', githubController.callback)
// router.use("/", githubController.index);

export default router
