import achievementsUtils from '../achievements/achievementsUtils'

const generateMessages = achievements => {
  return achievements.map(achievement => {
    const currentAchievement = getLastRatingEarned(achievement)

    return {
      text: `*${achievement.name}*:
      \n Você é ${currentAchievement.rating.name} ${currentAchievement.range.name} com total de ${currentAchievement.rating.total}.
      \n :trophy: Seu record é ${achievement.record.name} ${achievement.record.range} com total de ${achievement.record.total}.`
    }
  })
}

const getLastRatingEarned = achievement => {
  return achievementsUtils.getLastRatingEarned(achievement)
}

export default {
  generateMessages,
  getLastRatingEarned
}
