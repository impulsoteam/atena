import User from '../models/User'
import LogController from './LogController'
class RankingController {
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
            name: 1,
            score: 1,
            level: 1,
            uuid: 1
          }
        },

        { $skip: page ? parseInt(page) * parseInt(limit || 50) : 0 },
        { $limit: parseInt(limit) || 99999 }
      ])

      return ranking
    } catch (error) {
      LogController.sendNotify({
        type: 'error',
        file: 'controllers/RankingController.getGeneralRanking',
        resume: 'Unexpected error in RankingController.getGeneralRanking',
        details: error
      })
      return { message: `Não foi possível buscar o ranking`, error }
    }
  }
}

export default new RankingController()
