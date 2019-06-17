import config from 'config-yml'
import moment from 'moment-timezone'
import interactionsUtils from '../interactions/interactionsUtils'

const generateAchievementsMessages = achievements => {
  let messages = []

  achievements = calculatePositions(achievements)
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
  return (
    interaction.action !== config.actions.reaction.type ||
    (isPositiveReaction(interaction) || isAtenaReaction(interaction))
  )
}

const isPositiveReaction = interaction =>
  interactionsUtils.isPositiveReaction(interaction)

const isAtenaReaction = interaction =>
  interactionsUtils.isAtenaReaction(interaction)

const getLastRatingEarned = achievement => {
  let lastRating = achievement.ratings
    .reverse()
    .find(rating => rating.ranges.reverse().find(range => range.earnedDate))
  let lastRange = lastRating.ranges.find(range => range.earnedDate)

  return {
    name: lastRating.name,
    range: lastRange.name,
    total: lastRange.value,
    earnedDate: lastRange.earnedDate
  }
}

const getRecord = achievement => {
  let newRecord = getLastRatingEarned(achievement)

  if (
    !newRecord ||
    (achievement.record && !newRecordIsBigger(newRecord, achievement.record))
  ) {
    newRecord = achievement.record
  }

  return newRecord
}

const newRecordIsBigger = (newRecord, current) => {
  if (!current || !current.name) return true

  const positionRatings = getPositionRatings()
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newRecord.name.toLowerCase()
  )

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  )

  if (newPosition == currentPosition) {
    const type = current.level && newRecord.level ? 'level' : 'total'
    return newRecord[type] >= current[type]
  } else {
    return newPosition > currentPosition
  }
}

const getPositionRatings = () =>
  Object.keys(config.ratings).map(key => config.ratings[key])

const getInteractionType = interaction =>
  isChatInteraction(interaction) ? 'sended' : interaction.type

const isChatInteraction = interaction =>
  interactionsUtils.isChatInteraction(interaction)

const calculateScoreToIncrease = achievement => {
  let scoreToIncrease = 0
  const today = moment(new Date())

  achievement.ratings.map(rating => {
    let ranges = rating.ranges
    let lastRange = ranges[ranges.length - 1]
    let lastEarnedDate = lastRange.earnedDate

    if (
      lastEarnedDate != null &&
      moment(lastEarnedDate).isSame(today, 'day') &&
      (!achievement.total || achievement.total == lastRange.value)
    ) {
      scoreToIncrease = rating.xp
    }
  })

  return scoreToIncrease
}

const setEarned = achievement => {
  return achievement.ratings.map(rating => {
    let ranges = rating.ranges.map(range => {
      if (!range.earnedDate && range.value === achievement.total) {
        range.earnedDate = Date.now()
      }

      return generateRange(range)
    })

    return generateRating(rating, ranges)
  })
}

const generateRating = (rating, ranges) => {
  return {
    name: rating.name,
    xp: rating.xp,
    ranges: ranges
  }
}

const generateRange = doc => {
  return {
    name: doc.name,
    value: doc.value,
    earnedDate: doc.earnedDate
  }
}

const calculatePositions = achievements => {
  let ratings = null
  let achievementsPosition = achievements.map(achievement => {
    let range = null
    ratings = achievement.ratings.reduce((results, rating) => {
      range = getActiveRange(rating.ranges)

      if (range)
        results.push({
          name: `${rating.name} ${range.name}`,
          value: range.value
        })

      return results
    }, [])

    return {
      name: achievement.name,
      total: achievement.total,
      rating: getActiveRating(ratings, achievement.ratings)
    }
  })

  return achievementsPosition
}

const getActiveRating = (ratings, allRatings) => {
  return ratings[0] || getLastRating(allRatings)
}

const getLastRating = ratings => {
  const lastRatingIndex = ratings.length - 1
  const lastRating = ratings[lastRatingIndex]

  const lastRangeIndex = lastRating.ranges.length - 1
  const lastRange = lastRating.ranges[lastRangeIndex]

  return generateRating(lastRating, lastRange)
}

const getActiveRange = ranges => {
  let activeRange = false
  let total = ranges.length

  for (let i = 0; i < total; i++) {
    let range = ranges[i]
    if (!activeRange && range.earnedDate === null) {
      activeRange = {
        name: range.name,
        value: range.value
      }

      break
    }
  }

  return activeRange
}

export const getCurrentRating = achievement => {
  let current = {}
  let range

  for (let rating of achievement.ratings) {
    range = rating.ranges.find(range => !range.earnedDate)

    if (range) {
      current = {
        name: achievement.name,
        rating: rating.name,
        xp: rating.xp,
        range: range.name,
        total: range.value
      }
      break
    }
  }

  return current
}

const generateNewAchievement = (achievements, interaction, type, user) => {
  const category = config.categories[interaction.category]
  const action = config.actions[interaction.action]
  const ratings = generateNewRatings(achievements)

  const achievement = {
    name: `${category.name} | ${action.name} ${action[type]}`,
    kind: `${category.type}.${action.type}.${type}`,
    user: user._id,
    total: 0,
    ratings: ratings
  }

  return achievement
}

const generateNewRatings = achievements => {
  let currentRating = 0
  let ratings = []
  for (let item in achievements) {
    ratings.push(generateNewRating(achievements, item))

    for (let range in achievements[item].ranges) {
      ratings[currentRating].ranges.push(
        generateNewRange(achievements, item, range)
      )
    }

    currentRating++
  }

  return ratings
}

const generateNewRating = (achievements, item) => {
  return {
    name: achievements[item].name,
    xp: achievements[item].xp,
    ranges: []
  }
}

const generateNewRange = (achievements, item, range) => {
  return {
    name: range,
    value: achievements[item].ranges[range],
    earnedDate: null
  }
}

const getRoomToSendMessage = interaction => {
  let room = interaction.channelName
  if (!room) room = getRoomByInteraction(interaction)
  console.log('room', room)
  return room
}

const getRoomByInteraction = interaction => {
  let room = 'impulso-network'
  if (interactionsUtils.isGithubInteraction(interaction)) {
    room = 'open-source'
  }
  return room
}

export default {
  isValidAction,
  isValidReaction,
  generateAchievementsMessages,
  getLastRatingEarned,
  newRecordIsBigger,
  getRecord,
  getInteractionType,
  setEarned,
  getCurrentRating,
  calculateScoreToIncrease,
  generateNewAchievement,
  getRoomToSendMessage
}
