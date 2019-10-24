import axios from 'axios'
import fs from 'fs'
import path from 'path'

const onboardingTextPath = path.join(process.cwd(), 'config', 'onboarding.txt')
const text = fs.readFileSync(onboardingTextPath).toString()

const api = axios.create({
  baseURL: `${process.env.ROCKETCHAT_URL}/api/v1`,
  headers: {
    'X-User-Id': process.env.ROCKETCHAT_ONBOARDING_USER_ID,
    'X-Auth-Token': process.env.ROCKETCHAT_ONBOARDING_USER_TOKEN
  }
})

const sendOnboardingMessage = username => {
  const payload = { channel: `@${username}`, text }
  return api.post('/chat.postMessage', payload)
}

export default {
  sendOnboardingMessage
}
