export const scoreRules = {
  daysOfInactivity: 14,
  inactivityScore: -2,
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

export const levels = (() => {
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
  const scores = [50, 100, 150, 250, 400, 650, 1050, 1700, 2780]

  return badges.map((badge, index) => {
    const min = scores[index - 1] || 0
    const max = scores[index] ? scores[index] - 1 : 99999
    return {
      badge,
      level: index + 1,
      currentRange: { min, max },
      scoreToNextLevel: scores[index] || 99999
    }
  })
})()
