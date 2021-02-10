import { sendError } from 'log-on-slack'
import moment from 'moment'

import GeneralRanking from '../../models/GeneralRanking'
import MonthlyRanking from '../../models/MonthlyRanking'
import Score from '../../models/Score'
import User from '../../models/User'
import RankingUtils from './utils'

class RankingController extends RankingUtils {
  async getMonthlyRanking({ year, month, offset, size }) {
    const { date } = this.getDate({ year, month })

    if (moment().format('M') === moment(date).format('M')) {
      return MonthlyRanking.getCurrentRanking({ offset, size })
    } else {
      return Score.findAllByMonth({ date, offset, size })
    }
  }

  getGeneralRanking({ offset, size }) {
    return GeneralRanking.getCurrentRanking({ offset, size })
  }

  getMonthlyPositionByUser(uuid) {
    return MonthlyRanking.getUserPosition(uuid)
  }

  async removeUserFromRankings(uuid) {
    try {
      await MonthlyRanking.deleteOne({ uuid })
      await GeneralRanking.deleteOne({ uuid })
    } catch (error) {
      sendError({
        file: 'RankingController.removeUserFromRankings',
        payload: uuid,
        error
      })
    }
  }

  getGeneralPositionByUser(uuid) {
    return GeneralRanking.getUserPosition(uuid)
  }

  async createMonthlyRanking() {
    try {
      const { ranking } = await Score.findAllByMonth({ offset: 0, size: 99999 })

      for (const [index, user] of ranking.entries()) {
        await MonthlyRanking.updateUserRanking({ user, position: index + 1 })
      }
    } catch (error) {
      sendError({
        file: 'RankingController.createMonthlyRanking',
        error
      })
    }
  }

  async resetMonthlyRanking() {
    await MonthlyRanking.deleteMany({})
  }

  async createGeneralRanking() {
    try {
      const limit = 10000
      let skip = 0
      let position = 1

      while (true) {
        const ranking = await User.find(
          {
            isCoreTeam: false,
            'score.value': { $gt: 0 },
            anonymizedAt: null
          },
          {
            _id: 0,
            rocketchat: 1,
            name: 1,
            avatar: 1,
            score: '$score.value',
            level: '$level.value',
            uuid: 1
          }
        )
          .sort({
            'score.value': -1
          })
          .limit(limit)
          .skip(skip)

        if (!ranking.length) break

        for (const user of ranking) {
          await GeneralRanking.updateUserRanking({ user, position })
          position++
        }
        skip += limit
      }
    } catch (error) {
      sendError({
        file: 'RankingController.createGeneralRanking',
        error
      })
    }
  }
}

export default new RankingController()
