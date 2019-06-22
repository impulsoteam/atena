import express from 'express'
// import slackRoutes from './slack'
// import rocketRoutes from './rocket'
// import rankingRoutes from './ranking'
// import checkpointsRoutes from './checkpoints'
// import interactionsRoutes from './interactions'
// import gameRoutes from './game'
// import userRoutes from './user'
// import botRoutes from './bot'
// import githubRoutes from './github'
// import disqusRoutes from './disqus'
// import authRoutes from './auth'
// import rdRoutes from './rdstation'
// import resourcesRoutes from './resources'
// import minerRoutes from './miner'
// import blogRoutes from './blog'
// import apiRoutes from './api'
import achievementsTemporyData from '../components/achievementsTemporaryData'
import screens from '../components/screens'
import blog from '../components/blog'
import auth from '../components/auth'
import users from '../components/users'

const router = express.Router()

router.use('/achievements/temporary/data', achievementsTemporyData.routes)
router.use('/blog', blog.routes)
router.use('/auth', auth.routes)
router.use('/users', users.routes)
router.use('/api/v1/users', users.routes)

// router.use('/slack', slackRoutes)
// router.use('/rocket', rocketRoutes)
// router.use('/ranking', rankingRoutes)
// router.use('/checkpoints', checkpointsRoutes)
// router.use('/interactions', interactionsRoutes)
// router.use('/game', gameRoutes)
// router.use('/user', userRoutes)
// router.use('/bot/commands', botRoutes)
// router.use('/resources', resourcesRoutes)
// router.use('/integrations/github', githubRoutes)
// router.use('/integrations/disqus', disqusRoutes)
// router.use('/integrations/rd', rdRoutes)
// router.use('/miner', minerRoutes)
// router.use('/blog', blogRoutes)
// router.use('/api/v1', apiRoutes)

router.get('/', (req, res) =>
  screens.render(req, res, 'HowItWorks', {
    page: 'index'
  })
)

export default router
