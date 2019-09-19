import axios from 'axios'

const sslBase =
  process.env.ROCKETCHAT_USE_SSL === 'true' ? 'https://' : 'http://'
const rocketchatApiUrl = `${sslBase}${process.env.ROCKETCHAT_URL}/api/v1`

const onboardingApi = axios.create({
  baseURL: rocketchatApiUrl,
  headers: {
    'X-User-Id': process.env.ROCKETCHAT_ONBOARDING_USER_ID,
    'X-Auth-Token': process.env.ROCKETCHAT_ONBOARDING_USER_TOKEN
  }
})

export default {
  onboardingApi
}
