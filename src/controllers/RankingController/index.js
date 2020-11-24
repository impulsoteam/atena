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

  getGeneralPositionByUser(uuid) {
    return GeneralRanking.getUserPosition(uuid)
  }

  async createMonthlyRanking() {
    const { ranking } = await Score.findAllByMonth({ offset: 0, size: 99999 })

    for (const [index, user] of ranking.entries()) {
      const { uuid, score, name, avatar, level, rocketchat } = user

      await MonthlyRanking.findOneAndUpdate(
        { uuid },
        {
          uuid,
          score,
          name,
          avatar,
          level,
          rocketchat,
          position: index + 1
        },
        {
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true,
          new: true
        }
      )
    }
  }

  async createGeneralRanking() {
    const ranking = await User.aggregate([
      {
        $match: {
          isCoreTeam: false,
          'score.value': { $gt: 0 }
        }
      },
      { $sort: { 'score.value': -1 } },
      {
        $project: {
          _id: 0,
          rocketchat: 1,
          name: 1,
          avatar: 1,
          score: '$score.value',
          level: '$level.value',
          uuid: 1
        }
      }
    ])

    for (const [index, user] of ranking.entries()) {
      const { uuid, score, name, avatar, level, rocketchat } = user

      await GeneralRanking.findOneAndUpdate(
        { uuid },
        {
          uuid,
          score,
          name,
          avatar,
          level,
          rocketchat,
          position: index + 1
        },
        {
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true,
          new: true
        }
      )
    }
  }
}

export default new RankingController()
