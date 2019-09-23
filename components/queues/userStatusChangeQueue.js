import Queue from 'bull'
import logs from '../logs'
import logins from '../logins'
import users from '../users'
import api from '../axios'

const file = 'Queue | userStatusChangeQueue'

const inviteUserToChannelQueue = new Queue(
  'User Status Change',
  process.env.REDIS_URL
)

inviteUserToChannelQueue.process(async function(job) {
  const { rocketId, username } = job.data

  try {
    let [userInfo, user] = await Promise.all([
      api.adminUserApi.getUserInfoByUsername(username),
      users.findOne({ rocketId })
    ])

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
      return Promise.resolve()
    }

    if (lastUserLogin.status === status) {
      return Promise.resolve()
    }

    await logins.create({ status, user: user._id })
    return Promise.resolve()
  } catch (error) {
    console.log(error)
    errors._throw(file, 'sendMessageToRoom', e)
    return Promise.reject()
  }
})

export default inviteUserToChannelQueue
