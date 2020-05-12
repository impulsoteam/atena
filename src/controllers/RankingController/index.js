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
}

export default new RankingController()
const a = {
  impulser: {
    fullname: 'Leonardo',
    email: 'talkto@theleoad.com',
    network_email: 'leonardo@impulser.me',
    secondary_email: null,
    phone: '629991222121',
    telegram: null,
    photo:
      'https://lh3.googleusercontent.com/a-/AOh14GgYGTHVgTzL4z9S3350vKRMg0al2pMSfKFyMRQ3Ag',
    contact_preferences: ['email'],
    onboarding_step: 'recently_signedin',
    self_titled_seniority: 'pleno',
    stacks: ['Apache'],
    main_stacks: ['Apache'],
    address_street: 'Avenida Federal',
    address_number: '',
    address_zipcode: '75080045',
    address_neighbourhood: 'Maracananzinho',
    address_complement: '',
    address_city: 'Anápolis',
    address_state: 'Goiás',
    address_country: 'BR',
    address_confirmed: true,
    public_uuid: '97b45400-4510-4146-a9dd-0fd4ce0904a4',
    referrer_link: 'https://staging.impulser.me/3ef21c16',
    gender: null,
    race_color: null,
    available_to_opportunities: true,
    job_title: null,
    summary_by_impulser: null,
    years_of_experience: null,
    need_financial_details: false,
    onboarding_complete: true,
    clube25f_access: false,
    username: 'leonardo',
    network_email_smtp_password: 'asdf123',
    network_email_status: 'created',
    rocket_chat_user_id: 'zDXMrYiAm4Gy7TPfk',
    rocket_chat_deep_link: true,
    rocket_chat_token: 'fSiIWMlaK_5vqmaX6-nxoVBvCC2RwK__sal-dJn2iUs',
    rocket_chat_token_expires_at: '2020-05-15T18:11:56.956-03:00'
  }
}
