import config from 'config-yml'
import { isPositiveReaction, isAtenaReaction } from '../../utils/reactions'
import { calculateAchievementsPosition } from '../../utils'

const generateAchievementsMessages = achievements => {
  let messages = []

  achievements = calculateAchievementsPosition(achievements)
  if (achievements.length) {
    achievements.map(achievement => {
      messages.push({
        text: `*${achievement.name}*:
        \n Você é ${achievement.rating.name} com ${achievement.total}/${achievement.rating.value}.`
      })
    })
  }

  return messages
}

const isValidAction = interaction => {
  return (
    interaction.parentUser !== interaction.user && isValidReaction(interaction)
  )
}

const isValidReaction = interaction => {
  if (
    interaction.action === config.actions.reaction.type &&
    (!isPositiveReaction(interaction) && !isAtenaReaction(interaction))
  ) {
    return false
  }

  return true
}

const getLastRatingEarned = achievement => {
  let lastRatingEarned = {}
  let lastRangeEarned = {}

  let ratings = achievement.ratings.filter(rating => {
    let lastRangeFromRating = rating.ranges.filter(range => range.earnedDate)
    if (lastRangeFromRating.length) {
      lastRangeEarned = lastRangeFromRating[lastRangeFromRating.length - 1]
      return true
    }
  })

  lastRatingEarned = ratings[ratings.length - 1]

  if (lastRatingEarned && lastRangeEarned) {
    return {
      name: achievement.name,
      rating: lastRatingEarned || [],
      range: lastRangeEarned || []
    }
  }

  return achievement.record || {}
}

export default {
  isValidAction,
  isValidReaction,
  generateAchievementsMessages,
  getLastRatingEarned
}
