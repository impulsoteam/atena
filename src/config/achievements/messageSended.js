export const messageSended = () => {
  const medals = [
    {
      name: 'iron',
      displayMedal: 'Ferro',
      targets: [1, 2, 3, 5, 8],
      score: 5
    },
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [16, 27, 40, 56, 75],
      score: 10
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [108, 147, 192, 243, 300],
      score: 15
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [385, 481, 588, 705, 833],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [1008, 1200, 1408, 1633, 1875, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Mensagens Enviadas',
    name: 'messageSended',
    medals
  }
}
