import Queue from 'bull'
import api from '../axios'

const inviteUserToChannelQueue = new Queue(
  'Invite user to channel',
  process.env.REDIS_URL
)

inviteUserToChannelQueue.process(function(job) {
  const { userId, roomId, type } = job.data
  console.log(`Processing ${userId} into channel ${roomId}`)
  return api.adminUserApi.inviteUserToChannel(userId, roomId, type)
})

export default inviteUserToChannelQueue
