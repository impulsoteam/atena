import cron from 'node-cron'
import AchievementsTemporaryController from '../components/achievementsTemporary'
import { getStyleLog } from '../utils'

export default async () => {
  cron.schedule('0 0 0 * * *', async () => {
    let achievements = []

    try {
      achievements = await AchievementsTemporaryController.findInactivities()

      achievements.map(achievement => {
        let updatedAchievement = AchievementsTemporaryController.resetEarnedAchievements(
          achievement
        )
        updatedAchievement.save()
      })
    } catch (e) {
      console.log(
        getStyleLog('red'),
        `\n-- error updating inactivity temporary achievements`
      )
      return false
    }

    return true
  })
}
