const ranges = ['I', 'II', 'III', 'IV', 'V']

const formatAchievement = ({ name, medals }) => {
  const achievement = []
  for (const medal of medals) {
    for (const [index, target] of medal.targets.entries()) {
      achievement.push({
        name,
        medal: medal.name,
        target,
        range: ranges[index],
        score: medal.score
      })
    }
  }

  return achievement
}

export const messageSended = () => {
  // const medals = [
  //   { name: 'bronze', targets: [1, 2, 3, 5, 8], score: 3 },
  //   { name: 'silver', targets: [16, 27, 40, 56, 75], score: 5 },
  //   { name: 'gold', targets: [108, 147, 192, 243, 300], score: 7 },
  //   { name: 'platinum', targets: [385, 481, 588, 705, 833], score: 9 },
  //   { name: 'diamond', targets: [1008, 1200, 1408, 1633, 1875], score: 11 }
  // ]
  const medals = [
    { name: 'bronze', targets: [1, 2, 3, 4, 5], score: 3 },
    { name: 'silver', targets: [6, 7, 8, 9, 10], score: 5 },
    { name: 'gold', targets: [11, 12, 13, 14, 15], score: 7 },
    { name: 'platinum', targets: [16, 17, 18, 19, 20], score: 9 },
    { name: 'diamond', targets: [21, 23, 25, 27, 30, null], score: 11 }
  ]

  return formatAchievement({ name: 'messageSended', medals })
}

export const levelsList = () => {
  const badges = [
    'levelOne',
    'levelTwo',
    'levelThree',
    'levelFour',
    'levelFive',
    'levelSix',
    'levelSeven',
    'levelEight',
    'levelNine',
    'levelTen'
  ]
  // const scores = [50, 100, 150, 250, 400, 650, 1050, 1700, 2780, null]
  const scores = [8, 16, 24, 32, 40, 48, 56, 64, 72, null]

  return badges.map((badge, index) => ({
    name: 'userLevel',
    badge,
    level: index + 1,
    scoreToNextLevel: scores[index]
  }))
}

export const types = {
  messageSended: 'MESSAGE_SENDED'
}
