import axios from 'axios'
import { apiBaseUrl } from './utils'

const onboardingApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'X-User-Id': process.env.ROCKETCHAT_ONBOARDING_USER_ID,
    'X-Auth-Token': process.env.ROCKETCHAT_ONBOARDING_USER_TOKEN
  }
})

export default onboardingApi
