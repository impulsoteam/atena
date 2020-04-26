import Score from '../../models/Score'
import User from '../../models/User'
import LogController from '../LogController'
import RankingUtils from './utils'

class RankingController extends RankingUtils {
  async getMonthlyRanking({ year, month, limit, page }) {
    const { date, monthName } = await this.getDate({ year, month })

    try {
      const ranking = await Score.findAllByMonth({ date, limit, page })
      if (!ranking.length) {
        return {
          message: `Ops! Ainda ninguém pontuou em ${monthName}. =/`
        }
      }

      if (ranking.length < 3) {
        return {
          message: `Ops! Ranking incompleto em ${monthName}. =/`
        }
      }

      return ranking
    } catch (error) {
      LogController.sendError(error)
      return { message: `Não foi possível buscar o ranking`, error }
    }
  }

  async getGeneralRanking({ page, limit }) {
    try {
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
            rocketId: '$rocketchat.id',
            name: 1,
            avatar: 1,
            score: '$score.value',
            level: '$level.value',
            uuid: 1,
            username: '$rocketchat.username'
          }
        },

        { $skip: page ? parseInt(page) * parseInt(limit || 50) : 0 },
        { $limit: parseInt(limit) || 99999 }
      ])

      return ranking
    } catch (error) {
      LogController.sendError(error)
      return { message: `Não foi possível buscar o ranking`, error }
    }
  }

  async getMonthlyPositionByUser(uuid) {
    const ranking = await Score.findAllByMonth({})
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

  // async getMonthlyScoreByUser(uuid) {
  //   const [{ score }] = await Score.aggregate([
  //     {
  //       $match: {
  //         user: uuid,
  //         date: {
  //           $gte: moment()
  //             .startOf('month')
  //             .toDate(),
  //           $lt: moment()
  //             .endOf('month')
  //             .toDate()
  //         }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         score: { $sum: '$score' }
  //       }
  //     }
  //   ])

  //   return score
  // }
}

export default new RankingController()
