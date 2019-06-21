import cron from 'node-cron'
import config from 'config-yml'
import errors from '../errors'
import users from '../users'
import achievementsTemporary from '../achievementsTemporary'

const file = 'Cron | Controller'

const exec = () => {
  chatInactivities()
  achievementsTemporaryInactivities()
}

const chatInactivities = async () => {
  cron.schedule('* * * * *', async () => {
    try {
      const inactives = await users.findInactivities()
      await inactives.forEach(async user => {
        const score = config.xprules.inactive.value
        await users.updateScore(user, score)
      })
      return true
    } catch (e) {
      errors._throw(file, 'chatInativities', e)
      return false
    }
  })
}

const achievementsTemporaryInactivities = async () => {
  cron.schedule('0 0 0 * * *', async () => {
    try {
      const inactives = await achievementsTemporary.findInactivities()
      await inactives.map(async achievement => {
        const updatedAchievement = achievementsTemporary.resetEarned(
          achievement
        )
        await updatedAchievement.save()
      })
      return true
    } catch (e) {
      errors._throw(file, 'achievementsTemporaryInactivities', e)
      return false
    }
  })
}

export default {
  exec
}
