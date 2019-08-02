import moment from 'moment-timezone'
import crypto from '../components/crypto'
import users from '../components/users'

const auth = async function(req, res, next) {
  const authHeader = req.headers.authorization
  const [, token] = authHeader.split(' ')

  if (token) {
    const { uuid, expireAt } = await crypto.decrypt(token)

    if (!uuid) {
      return res.sendStatus(401).json({
        type: 'invalidToken',
        message: 'Token invalido.'
      })
    }

    const user = await users.find({ uuid: uuid })
    if (!user) {
      return res.sendStatus(401).json({
        type: 'invalidToken',
        message: 'Token inválido.'
      })
    }

    if (
      !moment(expireAt).isValid() ||
      moment(expireAt).isBefore(moment(new Date()))
    ) {
      return res.status(401).json({
        type: 'sessionExpired',
        message: 'Sua sessão expirou!'
      })
    }

    next()
  } else if (req.method === 'OPTIONS') {
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
