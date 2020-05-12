import Score from '../../models/Score'
import User from '../../models/User'
import RankingUtils from './utils'

class RankingController extends RankingUtils {
  async getMonthlyRanking({ year, month, offset, size }) {
    const { date } = await this.getDate({ year, month })
    const response = await Score.findAllByMonth({ date, offset, size })
    return response
  }

  async getGeneralRanking({ offset, size }) {
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
      },
      { $skip: parseInt(offset) },
      { $limit: parseInt(size) }
    ])

    const total = await User.countDocuments({
      isCoreTeam: false,
      'score.value': { $gt: 0 }
    })

    return { total, ranking }
  }

  async getMonthlyPositionByUser(uuid) {
    const { ranking } = await Score.findAllByMonth({ offset: 0, size: 99999 })
    const index = ranking.findIndex(user => user.uuid === uuid)

    if (index === -1)
      return {
        position: 0,
        score: 0
      }

    return {
      position: index + 1,
      score: ranking[index].score
    }
  }

  async getGeneralPositionByUser(uuid) {
    const ranking = await User.aggregate([
      {
        $match: {
          'score.value': { $gt: 0 },
          isCoreTeam: false
        }
      },
      { $project: { _id: 0, uuid: 1, score: 1 } },
      { $sort: { score: -1 } }
    ])
    const index = ranking.findIndex(user => user.uuid === uuid)

    if (index === -1)
      return {
        position: 0,
        score: 0
      }

    return {
      position: index + 1,
      score: ranking[index].score.value
    }
  }
}

export default new RankingController()
