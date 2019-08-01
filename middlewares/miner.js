import miner from '../components/miner'

const auth = function(req, res, next) {
  const { token } = req.headers
  const isMiner = miner.test(req.originalUrl) || false
  if (isMiner && token) {
    if (token !== process.env[`X_MINER_TOKEN`]) {
      res.sendStatus(401).json({
        type: 'invalidToken',
        message: 'Token inválido.'
      })
    } else {
      next()
    }
  } else if (isMiner && req.method === 'OPTIONS') {
    next()
  } else {
    return res.status(401).send({
      success: false,
      message: 'Nenhum token enviado.'
    })
  }
}

export default {
  auth
}
