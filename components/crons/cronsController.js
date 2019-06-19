import cron from 'node-cron'
import config from 'config-yml'
import errors from '../errors'
import users from '../users'

const file = 'Cron | Controller'

const exec = () => {
  chatInactivities()
}

const chatInactivities = async () => {
  cron.schedule('* * * * *', async () => {
    try {
      const inactives = await users.findInactivities()
      inactives.forEach(user => {
        const score = config.xprules.inactive.value
        users.updateScore(user, score)
      })
      return true
    } catch (e) {
      errors._throw(file, 'chatInativities', e)
      return false
    }
  })
}

export default {
  exec
}
