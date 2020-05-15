import { clickOnProduct } from './clickOnProduct'
import { messageSended } from './messageSended'

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
  messageSended: 'messageSended',
  clickOnProduct: 'clickOnProduct',
  chatAccess: 'chatAccess',
  externalEventsAccess: 'externalEventsAccess',
  internalMeetupsAccess: 'internalMeetupsAccess',
  opportunitiesAccess: 'opportunitiesAccess',
  impulsoTVAccess: 'impulsoTVAccess',
  blogAccess: 'blogAccess',
  curationAccess: 'curationAccess',
  benefitsClubAccess: 'benefitsClubAccess',
  ctechAccess: 'ctechAccess',
  communupAccess: 'communupAccess',
  atenaAccess: 'atenaAccess'
}

export default function getAchievementValues(type) {
  const name = type.includes('Access') ? 'clickOnProduct' : type
  const achievements = { messageSended, clickOnProduct }

  const ranges = achievements[name](type)

  return formatAchievement(ranges)
}
