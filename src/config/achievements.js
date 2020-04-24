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

export const messageSended = () => {
  const medals = [
    {
      name: 'bronze',
      translated: 'Bronze',
      targets: [1, 2, 3, 5, 8],
      score: 3
    },
    {
      name: 'silver',
      translated: 'Prata',
      targets: [16, 27, 40, 56, 75],
      score: 5
    },
    {
      name: 'gold',
      translated: 'Ouro',
      targets: [108, 147, 192, 243, 300],
      score: 7
    },
    {
      name: 'platinum',
      translated: 'Platina',
      targets: [385, 481, 588, 705, 833],
      score: 9
    },
    {
      name: 'diamond',
      translated: 'Diamante',
      targets: [1008, 1200, 1408, 1633, 1875, 999999],
      score: 11
    }
  ]

  return formatAchievement({
    translatedName: 'Mensagens Enviadas',
    name: 'messageSended',
    medals
  })
}

export const types = {
  messageSended: 'MESSAGE_SENDED'
}
