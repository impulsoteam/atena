import axios from '../axios'
import fs from 'fs'
import path from 'path'

const onboardingTextPath = path.join(process.cwd(), 'config', 'onboarding.txt')
const text = fs.readFileSync(onboardingTextPath).toString()

const sendOnboardingMessage = username => {
  const payload = { channel: `@${username}`, text }
  return axios.onboardingApi.post('/chat.postMessage', payload)
}

export default {
  sendOnboardingMessage
}
