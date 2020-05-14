const ranges = ['I', 'II', 'III', 'IV', 'V', 'VI']

const formatAchievement = ({ name, translatedName, medals }) => {
  const achievement = []
  for (const medal of medals) {
    for (const [index, target] of medal.targets.entries()) {
      achievement.push({
        name,
        translatedName,
        medal: medal.name,
        translatedMedal: medal.translated,
        target,
        range: ranges[index],
        score: medal.score
      })
    }
  }

  return achievement
}

const messageSended = () => {
  const medals = [
    {
      name: 'bronze',
      translated: 'Bronze',
      targets: [1, 2, 3, 5, 8],
      score: 5
    },
    {
      name: 'silver',
      translated: 'Prata',
      targets: [16, 27, 40, 56, 75],
      score: 10
    },
    {
      name: 'gold',
      translated: 'Ouro',
      targets: [108, 147, 192, 243, 300],
      score: 15
    },
    {
      name: 'platinum',
      translated: 'Platina',
      targets: [385, 481, 588, 705, 833],
      score: 20
    },
    {
      name: 'diamond',
      translated: 'Diamante',
      targets: [1008, 1200, 1408, 1633, 1875, 999999],
      score: 25
    }
  ]

  return formatAchievement({
    translatedName: 'Mensagens Enviadas',
    name: 'messageSended',
    medals
  })
}

const clickOnProduct = ({ subtitle, type }) => {
  const medals = [
    {
      name: 'bronze',
      translated: 'Bronze',
      targets: [1, 3, 6, 11, 17],
      score: 5
    },
    {
      name: 'silver',
      translated: 'Prata',
      targets: [33, 54, 81, 113, 150],
      score: 10
    },
    {
      name: 'gold',
      translated: 'Ouro',
      targets: [216, 294, 384, 486, 600],
      score: 15
    },
    {
      name: 'platinum',
      translated: 'Platina',
      targets: [771, 963, 1176, 1411, 1667],
      score: 20
    },
    {
      name: 'diamond',
      translated: 'Diamante',
      targets: [2017, 2400, 2817, 3267, 3750, 999999],
      score: 25
    }
  ]

  return formatAchievement({
    translatedName: `Clique em Produtos - ${subtitle}`,
    name: type,
    medals
  })
}

export const messageProviders = provider => {
  const defaultProvider = 'rocketchat'
  const providers = {
    rocketchat: 'rocketchat'
  }

  return providers[provider] || defaultProvider
}

export default function getAchievementValues(type) {
  const types = { messageSended, clickOnProduct }
  if (type.includes('|')) {
    const [title, subtitle] = type.split(' | ')
    return types[title]({ subtitle, type })
  }

  return types[type]()
}
