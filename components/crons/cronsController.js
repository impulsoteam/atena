import cron from 'node-cron'
import config from 'config-yml'
import errors from '../errors'
import logs from '../logs'
import users from '../users'
import interactions from '../interactions'
import achievementsTemporary from '../achievementsTemporary'

const file = 'Cron | Controller'

const exec = () => {
  chatInactivities()
  achievementsTemporaryInactivities()
}

const chatInactivities = async () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      logs.info('[*] Starting cron: chatInactivities')
      const inactives = await users.findInactivities()
      inactives.forEach(user => {
        const score = config.xprules.inactive.value
        users.updateScore(user, score)
        interactions.saveManual({
          score: score,
          type: 'inactivity',
          user: user._id
        })
      })
      logs.info('[*] Ending cron: chatInactivities')
    } catch (e) {
      errors._throw(file, 'chatInativities', e)
    }
  })
}

const achievementsTemporaryInactivities = async () => {
  cron.schedule('0 0 0 * * *', async () => {
    try {
      logs.info('[*] Starting cron: achievementsTemporaryInactivities')
      const inactives = await achievementsTemporary.findInactivities()
      inactives.map(achievement => {
        const updatedAchievement = achievementsTemporary.resetEarned(
          achievement
        )
        updatedAchievement.save()
      })
      logs.info('[*] Ending cron: achievementsTemporaryInactivities')
    } catch (e) {
      errors._throw(file, 'achievementsTemporaryInactivities', e)
    }
  })
}

export default {
  exec
}
