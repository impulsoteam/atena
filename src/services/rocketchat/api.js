import { api } from '@rocket.chat/sdk'

import LogController from '../../controllers/LogController'

export const connect = async () => {
  try {
    await api.login() // todo
  } catch (error) {
    LogController.sendNotify({
      type: 'error',
      file: 'services/rocketchat/api - connect',
      resume: 'Error while connecting',
      details: error
    })
  }
}

export const getPreviousMessage = async ({ roomId }) => {
  const { success, messages } = await api.get('channels.history', {
    roomId,
    count: 2
  })
  if (!success || !messages[1]) return false

  const { u, ts } = messages[1]
  return {
    user: u._id,
    createdAt: ts
  }
}
