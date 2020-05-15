export const messageSended = () => {
  const medals = [
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [1, 2, 3, 5, 8],
      score: 5
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [16, 27, 40, 56, 75],
      score: 10
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [108, 147, 192, 243, 300],
      score: 15
    },
    {
      name: 'platinum',
      displayMedal: 'Platina',
      targets: [385, 481, 588, 705, 833],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [1008, 1200, 1408, 1633, 1875, 999999],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Mensagens Enviadas',
    name: 'messageSended',
    medals
  }
}
