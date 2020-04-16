export const scoreRules = {
  dailyLimit: 60,
  flood: 60,
  message: {
    send: 3
  },
  thread: {
    send: 3,
    receive: 1
  }
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

  return badges.map((badge, index) => {
    const min = scores[index - 1] || 0
    const max = scores[index] ? scores[index] - 1 : 9999
    return {
      badge,
      level: index + 1,
      range: [min, max],
      scoreToNextLevel: scores[index]
    }
  })
}
