export const reactionReceived = () => {
  const medals = [
    {
      name: 'iron',
      displayMedal: 'Ferro',
      targets: [1, 4, 9, 16, 25],
      score: 5
    },
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [49, 81, 121, 169, 225],
      score: 10
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [324, 441, 576, 729, 900],
      score: 15
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [1156, 1444, 1764, 2116, 2500],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [2035, 3600, 4225, 4900, 5625, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Reações Recebidas',
    name: 'reactionReceived',
    medals
  }
}
