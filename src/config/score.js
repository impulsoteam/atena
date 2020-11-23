export const scoreRules = {
  clickOnProduct: {
    limit: 24,
    score: 2
  },
  newsletterRead: {
    score: 2,
    limit: 168
  },
  profileCompleteness: {
    20: 5,
    40: 10,
    60: 15,
    80: 20,
    100: 25
  },
  dailyLimit: 60,
  flood: 60,
  message: {
    send: 3
  },
  reaction: {
    send: 2,
    receive: 3
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
    'levelFive'
  ]
  const scores = [50, 250, 650, 1050]

  return badges.map((badge, index) => {
    const min = scores[index - 1] || 0
    const max = scores[index] ? scores[index] - 1 : null
    return {
      badge,
      level: index + 1,
      currentRange: { min, max },
      scoreToNextLevel: scores[index] || null
    }
  })
})()
