export const newslettersRead = () => {
  const medals = [
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [1, 2, 4, 6, 8],
      score: 5
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [11, 18, 27, 38, 50],
      score: 10
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [72, 98, 128, 162, 200],
      score: 15
    },
    {
      name: 'platinum',
      displayMedal: 'Platina',
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
