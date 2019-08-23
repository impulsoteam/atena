import moment from 'moment-timezone'
import service from './linkedinService'
import users from '../users'
import errors from '../errors'
import crypto from '../crypto'

const file = 'Linkedin | Controller'

const auth = async code => {
  if (!code) return { error: 'Code não enviado' }

  try {
    const linkedinUser = await service.getUserInfoByCode(code)
    if (linkedinUser.error) return linkedinUser

    const user = await users.findOne({ linkedinId: linkedinUser.id })
    if (!user) {
      return { error: 'Usuário não encontrado' }
    }

    const expireAt = process.env.ATENA_EXPIRE_TOKEN
    const data = {
      avatar: user.avatar || '',
      uuid: user.uuid || '',
      isCoreTeam: user.isCoreTeam || false,
      expireAt: moment()
        .add(expireAt, 'minutes')
        .format()
    }

    const token = await crypto.encrypt(data)
    return { token }
  } catch (e) {
    errors._throw(file, 'auth', e)
    return { error: 'Erro ao acessar linkedin auth' }
  }
}

export default {
  auth
}
