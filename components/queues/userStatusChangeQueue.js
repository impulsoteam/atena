import Queue from 'bull'
import logs from '../logs'
import logins from '../logins'
import users from '../users'
import { api } from '@rocket.chat/sdk'

const file = 'Queue | userStatusChangeQueue'

const userStatusChangeQueue = new Queue(
  'User Status Change',
  process.env.REDIS_URL
)

userStatusChangeQueue.process(async function(job) {
  const { rocketId, username } = job.data
  logs.info(`[*] Started queue userStatusChange for user ${username}`)

  try {
    const userInfo = await api
      .get('users.info', { username })
      .then(response => response.user)

    if (userInfo.roles.includes('bot')) {
      logs.info(`[*] Finished queue userStatusChange for bot ${username}`)
      return
    }

    let user = await users.findOne({ rocketId })

    const status =
      userInfo.statusConnection === 'offline' ? 'offline' : 'online'

    if (!user) {
      const { name, emails } = userInfo
      const email = emails[0].address
      user = await users.create({ rocketId, username, name, email })
    }

    const lastUserLogin = await logins
      .findOne({ user: user._id })
      .sort({ createdAt: -1 })

    if (!lastUserLogin) {
      await logins.create({ status, user: user._id })
      logs.info(`[*] Finished queue userStatusChange for user ${username}`)
      return Promise.resolve()
    }

    if (lastUserLogin.status === status) {
      logs.info(`[*] Finished queue userStatusChange for user ${username}`)
      return Promise.resolve()
    }

    await logins.create({ status, user: user._id })
    logs.info(`[*] Finished queue userStatusChange for user ${username}`)
    return Promise.resolve()
  } catch (error) {
    console.log(error)
    logs.info(`[*] Error in queue userStatusChange for user ${username}`)
    errors._throw(file, 'sendMessageToRoom', e)
    return Promise.reject()
  }
})

export default userStatusChangeQueue
