import axios from 'axios'

const getUserInfoByCode = async code => {
  const accessToken = await getAccessTokenByCode(code)
  if (!accessToken) {
    return { error: 'Sem resposta do linkedin' }
  }

  const user = await getUserInfoByAccessToken(accessToken)
  if (!user) {
    return { error: 'Sem resposta de infos do usuário no linkedin' }
  }

  return user
}

const getAccessTokenByCode = async code => {
  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('client_id', process.env.LINKEDIN_KEY)
  params.append('client_secret', process.env.LINKEDIN_SECRET)
  params.append('redirect_uri', process.env.LINKEDIN_URL_CALLBACK)
  params.append('code', code)

  const url = `${process.env.LINKEDIN_OAUTH_URL}/accessToken`
  let result = await axios.post(url, params)

  return result ? result.data.access_token : false
}

const getUserInfoByAccessToken = async accessToken => {
  const url = `${process.env.LINKEDIN_API_URL}/me`
  let result = await axios.get(url, {
    accept: 'json',
    headers: { Authorization: 'Bearer ' + accessToken }
  })

  return result ? result.data : false
}

export default {
  getUserInfoByCode
}
