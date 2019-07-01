import express from 'express'
import miner from './minerController'

const router = express.Router()

const verifyToken = function(req, res, next) {
  const { token } = req.headers
  const isMiner = miner.test(req.originalUrl) || false
  if (isMiner && token) {
    if (token !== process.env[`X_MINER_TOKEN`]) {
      res.sendStatus(401)
    } else {
      next()
    }
  } else if (isMiner && req.method === 'OPTIONS') {
    next()
  } else {
    return res.status(401).send({
      success: false,
      message: 'No token provided.'
    })
  }
}

router.get('/ranking', verifyToken, async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const limit = req.headers.limit ? req.headers.limit : 9999999
  const result = await miner.getAllUsers(team)
  return res.json(result)
})

router.get('/ranking/geral', verifyToken, async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const limit = req.headers.limit ? req.headers.limit : 9999999
  const result = await miner.getGeneralRanking(team, limit)
  return res.json(result)
})

router.get('/ranking/mes/:month', verifyToken, async (req, res) => {
  const team = req.headers.team ? req.headers.team : false
  const result = await miner.getRankingByMonth(req.params.month, team)
  return res.json(result)
})

router.get('/mostactive', verifyToken, async (req, res) => {
  const result = await miner.getMostActiveUsers(
    req.headers.begin,
    req.headers.end
  )
  return res.json(result)
})

export default router