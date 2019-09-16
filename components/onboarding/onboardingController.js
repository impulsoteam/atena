import service from './onboardingService'

const sendOnboardingMessage = username => {
  return service.sendOnboardingMessage(username)
}

export default {
  sendOnboardingMessage
}
