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

const achievementsTemporaryInactivities = async () => {
  cron.schedule('0 0 0 * * *', async () => {
    try {
      const achievements = await achievementsTemporary.findInactivities()
      achievements.map(achievement => {
        const updatedAchievement = achievementsTemporary.resetEarned(
          achievement
        )
        updatedAchievement.save()
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
