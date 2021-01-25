export const subscribedToMeetup = () => {
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
      targets: [7, 9, 11, 13, 15],
      score: 10
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [18, 21, 24, 27, 30],
      score: 15
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [34, 38, 42, 46, 50],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [55, 60, 65, 70, 250, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Inscrição em Meetups',
    name: 'subscribedToMeetup',
    medals
  }
}
