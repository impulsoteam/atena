import cron from 'node-cron'
import config from 'config-yml'
import errors from '../errors'
import logs from '../logs'
import users from '../users'
import interactions from '../interactions'
import achievementsTemporary from '../achievementsTemporary'
import rankings from '../rankings'

const file = 'Cron | Controller'

const exec = () => {
  chatInactivities()
  achievementsTemporaryInactivities()
  generateMonthlyRanking()
  sendToChannelTop5Ranking()
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
          score,
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

const generateMonthlyRanking = async () => {
  cron.schedule(
    '1 0 * * *',
    async () => {
      try {
        logs.info('[*] Starting cron: generateMonthlyRanking')
        const today = new Date(Date.now())
        await rankings.generate(today.getMonth())
        logs.info('[*] Ending cron: generateMonthlyRanking')
      } catch (e) {
        errors._throw(file, 'generateMonthlyRanking', e)
      }
    },
    null,
    true,
    'America/Sao_Paulo'
  )
}

const sendToChannelTop5Ranking = async () => {
  cron.schedule(
    '* 9 * * mon',
    async () => {
      try {
        logs.info('[*] Starting cron: sendToChannelTop5Ranking')
        await rankings.sendToChannel()
        logs.info('[*] Ending cron: sendToChannelTop5Ranking')
      } catch (e) {
        errors._throw(file, 'sendToChannelTop5Ranking', e)
      }
    },
    null,
    true,
    'America/Sao_Paulo'
  )
}

export default {
  exec
}
