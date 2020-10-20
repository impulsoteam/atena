import { clickOnProduct, products } from './clickOnProduct'
import { messageSended } from './messageSended'
import { newslettersRead } from './newslettersRead'
import { reactionReceived } from './reactionReceived'
import { reactionSended } from './reactionSended'

const ranges = ['I', 'II', 'III', 'IV', 'V', 'VI']

const formatAchievement = ({ name, displayAchievement, medals }) => {
  const achievement = []
  for (const medal of medals) {
    for (const [index, target] of medal.targets.entries()) {
      achievement.push({
        name,
        displayNames: {
          achievement: displayAchievement,
          medal: medal.displayMedal
        },
        medal: medal.name,
        target,
        range: ranges[index],
        score: medal.score
      })
    }
  }

  return achievement
}

export const messageProviders = provider => {
  const defaultProvider = 'rocketchat'
  const providers = {
    rocketchat: 'rocketchat'
  }

  return providers[provider] || defaultProvider
}

export const achievementTypes = {
  atenaAccess: 'atenaAccess',
  benefitsClubAccess: 'benefitsClubAccess',
  blogAccess: 'blogAccess',
  chatAccess: 'chatAccess',
  clickOnProduct: 'clickOnProduct',
  curationAccess: 'curationAccess',
  ctechAccess: 'ctechAccess',
  communupAccess: 'communupAccess',
  externalEventsAccess: 'externalEventsAccess',
  impulsoTVAccess: 'impulsoTVAccess',
  internalMeetupsAccess: 'internalMeetupsAccess',
  messageSended: 'messageSended',
  newslettersRead: 'newslettersRead',
  reactionReceived: 'reactionReceived',
  reactionSended: 'reactionSended',
  opportunitiesAccess: 'opportunitiesAccess'
}

export default function getAchievementValues(type) {
  const name = type.includes('Access') ? 'clickOnProduct' : type
  const achievements = {
    messageSended,
    reactionSended,
    reactionReceived,
    clickOnProduct,
    newslettersRead
  }

  const ranges = achievements[name](type)

  return formatAchievement(ranges)
}

export const getAllAchievements = userAchievements => {
  const achievements = [
    messageSended,
    reactionSended,
    reactionReceived,
    newslettersRead
  ]

  const allAchievements = []

  for (const achievement of achievements) {
    allAchievements.push(getDefaultAchievement(achievement()))
  }

  for (const product of Object.values(products)) {
    allAchievements.push(getDefaultAchievement(clickOnProduct(product)))
  }

  return allAchievements.map(achievement => {
    const scoredAchievement = userAchievements.find(
      ({ name }) => name === achievement.name
    )
    return scoredAchievement || achievement
  })
}

const getDefaultAchievement = ({ displayAchievement, name, medals }) => ({
  displayNames: {
    achievement: displayAchievement,
    medal: medals[0].displayMedal
  },
  name,
  range: 'I',
  currentValue: 0,
  medal: medals[0].name,
  nextTarget: medals[0].targets[0]
})
