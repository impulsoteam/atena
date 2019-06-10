import config from 'config-yml'
import service from './interactionService'
import model from '../../models/interaction'
import { _today } from '../../helpers'

export const todayScore = async rocketId => {
  return model
    .find({
      user: rocketId,
      date: {
        $gte: _today.start
      }
    })
    .then(interactions => {
      const total = interactions.reduce(
        (prevVal, interaction) => prevVal + interaction.score,
        0
      )
      return total
    })
    .catch(() => Promise.reject(0))
}

export const isOnDailyLimit = async interaction => {
  const todayLimitScore = config.xprules.limits.daily

  return todayScore(interaction.user).then(score => {
    const todayLimitStatus = todayLimitScore - score
    return todayLimitStatus > 0 || !todayLimitStatus
  })
}

/**
 * O limite diario ta centralizado nessa função, talvez seja interessante cada
 * modulo ter seu limite diario de acordo com a sua integração. e ai essas
 * verificações devem ser tratada em cada módulo individualmente e só passar
 * para essa função o objeto com o score zerado ou não
 */
export const save = async obj => {
  return isOnDailyLimit(obj)
    .then(isInLimit => {
      if (!isInLimit) obj.score = 0
      return service.userUpdateScoreLevel(obj)
    })
    .then(user => {
      return service.achievementSave(obj, user)
    })
    .then(() => {
      return model(obj).save()
    })
}
