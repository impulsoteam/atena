import { api } from '@rocket.chat/sdk'
import axios from 'axios'
import moment from 'moment'

import User from '../models/User'
import { encrypt } from '../services/crypto'
import LogController from './LogController'

class SessionController {
  async linkedin(code) {
    if (!code) return { error: 'Code não enviado' }
    try {
      const linkedinUser = await this.getUserByCode(code)
      if (linkedinUser.error) return linkedinUser

      const user = await User.findOne({ 'linkedin.id': linkedinUser.id })
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

      const token = await encrypt(data)
      return { token }
    } catch (error) {
      LogController.sendError(error)
      return { error }
    }
  }

  async rocketchat(username, password) {
    try {
      const login = await api.post('login', {
        user: username,
        password: password
      })

      if (login && login.status === 'success') {
        const user = await User.findOne({ 'rocketchat.id': login.data.userId })
        if (!user) {
          return { error: 'Usuário não encontrado na Atena' }
        }

        const expireAt = process.env.ATENA_EXPIRE_TOKEN
        const data = {
          avatar: user.avatar,
          uuid: user.uuid,
          isCoreTeam: user.isCoreTeam,
          expireAt: moment()
            .add(expireAt, 'minutes')
            .format()
        }

        const token = await encrypt(data)
        return { token }
      } else {
        return { error: 'Usuário não encontrado no Rocket.Chat' }
      }
    } catch (error) {
      LogController.sendError(error)
      return { error: 'Erro ao acessar Rocket.Chat auth' }
    }
  }

  async getUserByCode(code) {
    const accessToken = await this.getAccessTokenByCode(code)
    if (!accessToken) {
      return { error: 'Sem resposta do linkedin' }
    }

    const user = await this.getUserInfoByAccessToken(accessToken)
    if (!user) {
      return { error: 'Sem resposta de infos do usuário no linkedin' }
    }

    return user
  }

  async getAccessTokenByCode(code) {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('client_id', process.env.LINKEDIN_KEY)
    params.append('client_secret', process.env.LINKEDIN_SECRET)
    params.append('redirect_uri', process.env.LINKEDIN_URL_CALLBACK)
    params.append('code', code)

    const url = `${process.env.LINKEDIN_OAUTH_URL}/accessToken`
    const result = await axios.post(url, params)

    return result ? result.data.access_token : false
  }

  async getUserInfoByAccessToken(accessToken) {
    const url = `${process.env.LINKEDIN_API_URL}/me`
    const result = await axios.get(url, {
      accept: 'json',
      headers: { Authorization: 'Bearer ' + accessToken }
    })

    return result ? result.data : false
  }
}
export default new SessionController()
