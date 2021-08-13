import { sendError, sendNotify } from 'log-on-slack'
import moment from 'moment'

import { getAllAchievements } from '../../config/achievements'
import User from '../../models/User'
import { updateSubscribers as updateDripSubscribers } from '../../services/drip'
import { updateContacts as updateMailJetContacts } from '../../services/mailJet'
import { sleep } from '../../utils'
import UserUtils from './utils'

class UserController extends UserUtils {
  constructor() {
    super()
  }

  async handle(payload) {
    try {
      const { user } = await User.createOrUpdate(payload)

      if (
        user.referrer &&
        user.referrer.type === 'partner' &&
        user.referrer.identification
      )
        this.handleUserPartner(user)
    } catch (error) {
      sendError({
        file: 'controllers/UserController.handle',
        payload,
        error
      })
    }
  }

  async anonymize(user) {
    try {
      user.name = null
      user.avatar = null

      await User.createOrUpdate(user)
    } catch (error) {
      sendError({
        file: 'UserController.anonymize',
        payload: user,
        error
      })
    }
  }

  async getProfile(uuid) {
    const user = await User.findOne({ uuid })
    if (!user) throw new Error(`Unable to find ${uuid}`)

    const general = await RankingController.getGeneralPositionByUser(uuid)
    const monthly = await RankingController.getMonthlyPositionByUser(uuid)
    user.achievements = getAllAchievements(user.achievements)

    return {
      user,
      rankings: { general, monthly }
    }
  }

  async updateEmailServices() {
    try {
      const totalUsers = await User.countDocuments({})
      let dripSubscribers = []
      let mailJetContacts = []

      const sendBatch = async () => {
        await sleep(5000)
        updateDripSubscribers(dripSubscribers)
        updateMailJetContacts(mailJetContacts)

        dripSubscribers = []
        mailJetContacts = []
      }

      const { ranking: monthly } = await RankingController.getMonthlyRanking({
        offset: 0,
        size: totalUsers
      })

      const coreTeam = await User.find({ isCoreTeam: true })
      monthly.push(...coreTeam)

      const { ranking: general } = await RankingController.getGeneralRanking({
        offset: 0,
        size: totalUsers
      })

      for (const [position, user] of Object.entries(monthly)) {
        const {
          email,
          score,
          level,
          achievements,
          isCoreTeam
        } = await User.findOne({
          uuid: user.uuid
        })

        const impulserProperties = {
          atena_level: level.value,
          score_to_next_level: level.scoreToNextLevel,
          number_of_achievements: achievements.length,
          ranking_monthly_position: isCoreTeam ? 0 : parseInt(position) + 1,
          ranking_monthly_score: isCoreTeam ? 0 : user.score,
          ranking_general_position: isCoreTeam
            ? 0
            : general.findIndex(({ uuid }) => uuid === user.uuid) + 1,
          ranking_general_score: score.value,
          atena_updated_at: moment().toDate()
        }

        if (achievements.length) {
          const { name, medal, range } = achievements.sort(
            (a, b) => b.earnedIn - a.earnedIn
          )[0]
          impulserProperties.last_achievements = `${name} - ${medal} - ${range}`
        }

        dripSubscribers.push({
          email,
          custom_fields: impulserProperties
        })

        mailJetContacts.push({
          Email: email,
          Properties: impulserProperties
        })

        if (dripSubscribers.length === 999) await sendBatch()
      }

      await sendBatch()

      sendNotify({
        file: 'controllers/UserController.updateEmailServices',
        resume: 'Job done!',
        details: { usersUpdated: monthly.length }
      })
    } catch (error) {
      sendError({
        file: 'controllers/UserController.updateEmailServices',
        error
      })
    }
  }
}

export default new UserController()
