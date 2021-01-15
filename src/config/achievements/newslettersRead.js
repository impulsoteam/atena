export const newslettersRead = () => {
  const medals = [
    {
      name: 'iron',
      displayMedal: 'Ferro',
      targets: [1, 2, 4, 6, 8],
      score: 5
    },
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [11, 18, 27, 38, 50],
      score: 10
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [72, 98, 128, 162, 200],
      score: 15
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [257, 321, 392, 470, 556],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [672, 800, 939, 1089, 1250, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Newsletters Lidas',
    name: 'newslettersRead',
    medals
  }
}
