import config from 'config-yml'
import { driver } from '@rocket.chat/sdk'
import {
  getInteractionType,
  calculateAchievementScoreToIncrease,
  getAchievementNextRating,
  saveScoreInteraction
} from '../../utils/achievements'
import { sendEarnedAchievementMessage } from '../../utils/achievementsMessages'
import userController from '../../controllers/user'
import dal from './achievementsDAL'
import utils from './achievementsUtils'
import service from './achievementsService'

const commandIndex = async message => {
  try {
    const interaction = {
      origin: 'rocket',
      user: message.u._id
    }
    const user = await userController.findByOrigin(interaction)
    const response = await service.getAllMessages(user)
    await driver.sendDirectToUser(response, message.u.username)
  } catch (e) {
    console.log('[ACHIEVEMENTS] Commands error: ', e)
  }
}

const save = async (interaction, user) => {
  try {
    if (utils.isValidAction(interaction)) {
      const type = getInteractionType(interaction)
      await saveUserAchievement(type, interaction, user)

      if (interaction.parentUser) {
        const parentUser = await userController.findByOrigin(interaction, true)
        await saveUserAchievement('received', interaction, parentUser)
      }
    }
  } catch (error) {
    console.log('[ACHIEVEMENTS] Save error: ', error)
  }
}

const saveUserAchievement = async (type, interaction, user) => {
  const query = {
    user: user._id,
    kind: `${interaction.category}.${interaction.action}.${type}`
  }

  let achievement = await dal.findOne(query)
  if (achievement) {
    achievement.total += 1
    achievement.ratings = updateRangeEarnedDate(achievement)
    await addScore(user, achievement)
    return achievement.save()
  } else {
    achievement = createAchievement(interaction, type, user)
    if (achievement) {
      return dal.create(achievement)
    }
  }
}

const addScore = async (user, achievement) => {
  const score = calculateAchievementScoreToIncrease(achievement)

  if (score > 0) {
    await userController.updateScore(user, score)
    await saveScoreInteraction(user, achievement, score, 'Conquista Permanente')
    await sendEarnedAchievementMessage(
      user,
      getAchievementNextRating(achievement)
    )
  }
}

const updateRangeEarnedDate = achievement => {
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

const createAchievement = (interaction, type, user) => {
  const achievements = dal.findMain(
    interaction.category,
    interaction.action,
    type
  )
  let achievement = null

  if (achievements) {
    achievement = generateNewAchievement(interaction, type, user)

    let currentRating = 0
    for (let item in achievements) {
      achievement.ratings.push(generateNewRating(achievements, item))

      for (let range in achievements[item].ranges) {
        achievement.ratings[currentRating].ranges.push(
          generateNewRange(achievements, item, range)
        )
      }

      currentRating++
    }

    achievement = service.addFirstNewEarnedDate(achievement)
    service.sendEarnedMessages(user, achievement)
  }

  return achievement
}

const generateNewAchievement = (interaction, type, user) => {
  const category = config.categories[interaction.category]
  const action = config.actions[interaction.action]

  return {
    name: `${category.name} | ${action.name} ${action[type]}`,
    kind: `${category.type}.${action.type}.${type}`,
    user: user._id,
    total: 1,
    ratings: []
  }
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

export default {
  save,
  commandIndex
}
