export const participatedToMeetup = () => {
  const medals = [
    {
      name: 'iron',
      displayMedal: 'Ferro',
      targets: [1, 2, 3, 4, 5],
      score: 5
    },
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [6, 7, 8, 9, 10],
      score: 10
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [12, 14, 16, 18, 20],
      score: 15
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [23, 26, 29, 32, 35],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [40, 45, 50, 55, 60, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Participação em Meetups',
    name: 'participatedToMeetup',
    medals
  }
}
