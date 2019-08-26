import moment from 'moment-timezone'
import crypto from '../components/crypto'
import users from '../components/users'
import errors from '../components/errors'

const auth = async function(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        type: 'invalidToken',
        message: 'Nenhum token enviado.'
      })
    }

    const [, token] = authHeader.split(' ')

    if (token) {
      const { uuid, expireAt } = await crypto.decrypt(token)

      if (!uuid) {
        return res.sendStatus(401).json({
          success: false,
          type: 'invalidToken',
          message: 'Token inválido.'
        })
      }

      const user = await users.find({ uuid: uuid })
      if (!user) {
        return res.sendStatus(401).json({
          success: false,
          type: 'invalidToken',
          message: 'Token inválido.'
        })
      }

      if (
        !moment(expireAt).isValid() ||
        moment(expireAt).isBefore(moment(new Date()))
      ) {
        return res.status(401).json({
          success: false,
          type: 'sessionExpired',
          message: 'Sua sessão expirou!'
        })
      }

      next()
    } else if (req.method === 'OPTIONS') {
      next()
    } else {
      return res.status(401).send({
        type: 'invalidToken',
        success: false,
        message: 'Nenhum token enviado.'
      })
    }
  } catch (e) {
    errors._throw('API | Middleware', 'auth', e)

    return res.sendStatus(401).json({
      success: false,
      type: 'invalidToken',
      message: 'Token inválido.'
    })
  }
}

export default {
  auth
}
